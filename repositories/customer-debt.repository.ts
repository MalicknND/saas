/**
 * Customer debt - computed from orders and payments.
 * One query per customer with aggregations for efficiency.
 */
import type { RepositoryClient } from "./base";
import type { CustomerWithDebt } from "@/types";

export const customerDebtRepository = {
  /**
   * Get all customers with their debt (total_orders - total_paid).
   * Uses RPC for efficiency, or falls back to client-side computation.
   */
  async listWithDebt(client: RepositoryClient, workspaceId: string): Promise<CustomerWithDebt[]> {
    // Fetch customers and their order totals + payment totals
    const { data: customers, error: customersError } = await client
      .from("customers")
      .select("id, workspace_id, name, phone, notes, created_at, updated_at")
      .eq("workspace_id", workspaceId)
      .order("name");

    if (customersError) throw customersError;
    if (!customers?.length) return [];

    const customerIds = customers.map((c: { id: string }) => c.id);

    // Get order totals per customer
    const { data: ordersData } = await client
      .from("orders")
      .select("customer_id, total_price")
      .eq("workspace_id", workspaceId)
      .in("customer_id", customerIds);

    const orderTotals = new Map<string, number>();
    for (const o of ordersData ?? []) {
      const id = o.customer_id as string;
      orderTotals.set(id, (orderTotals.get(id) ?? 0) + Number(o.total_price));
    }

    // Get payment totals per order, then map to customer via orders
    const { data: ordersForPayments } = await client
      .from("orders")
      .select("id, customer_id")
      .eq("workspace_id", workspaceId)
      .in("customer_id", customerIds);

    const orderToCustomer = new Map((ordersForPayments ?? []).map((o: { id: string; customer_id: string }) => [o.id, o.customer_id]));

    const { data: paymentsData } = await client
      .from("order_payments")
      .select("order_id, amount")
      .eq("workspace_id", workspaceId)
      .in("order_id", Array.from(orderToCustomer.keys()));

    const paymentTotalsByCustomer = new Map<string, number>();
    for (const p of paymentsData ?? []) {
      const customerId = orderToCustomer.get(p.order_id as string);
      if (customerId) {
        paymentTotalsByCustomer.set(
          customerId,
          (paymentTotalsByCustomer.get(customerId) ?? 0) + Number(p.amount)
        );
      }
    }

    return (customers as { id: string; workspace_id: string; name: string; phone: string | null; notes: string | null; created_at: string; updated_at: string }[]).map(
      (c) => {
        const total_orders = orderTotals.get(c.id) ?? 0;
        const total_paid = paymentTotalsByCustomer.get(c.id) ?? 0;
        const debt = Math.max(0, total_orders - total_paid);
        return {
          ...c,
          total_orders,
          total_paid,
          debt,
        } as CustomerWithDebt;
      }
    ).filter((c) => c.debt > 0)
    .sort((a, b) => b.debt - a.debt);
  },
};
