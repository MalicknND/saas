import type { RepositoryClient } from "./base";
import type { Order, OrderPayment } from "@/types/database";

export const orderRepository = {
  async listByWorkspace(
    client: RepositoryClient,
    workspaceId: string,
    options?: { deliveryDate?: string; customerId?: string }
  ) {
    let query = client
      .from("orders")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("delivery_date", { ascending: false });

    if (options?.deliveryDate) {
      query = query.eq("delivery_date", options.deliveryDate);
    }
    if (options?.customerId) {
      query = query.eq("customer_id", options.customerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Order[];
  },

  async getById(client: RepositoryClient, id: string, workspaceId: string) {
    const { data, error } = await client
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) throw error;
    return data as Order;
  },

  async create(client: RepositoryClient, input: Omit<Order, "id" | "created_at" | "updated_at">) {
    const { data, error } = await client
      .from("orders")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async update(
    client: RepositoryClient,
    id: string,
    workspaceId: string,
    input: Partial<Pick<Order, "status" | "payment_status" | "items" | "total_price" | "delivery_date" | "notes">>
  ) {
    const { data, error } = await client
      .from("orders")
      .update(input)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async delete(client: RepositoryClient, id: string, workspaceId: string) {
    const { error } = await client
      .from("orders")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
  },
};

// --- Order Payments ---

export const orderPaymentRepository = {
  async listByOrder(client: RepositoryClient, orderId: string, workspaceId: string) {
    const { data, error } = await client
      .from("order_payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("workspace_id", workspaceId)
      .order("paid_at", { ascending: false });

    if (error) throw error;
    return data as OrderPayment[];
  },

  async getTotalPaid(client: RepositoryClient, orderId: string): Promise<number> {
    const { data, error } = await client
      .from("order_payments")
      .select("amount")
      .eq("order_id", orderId);

    if (error) throw error;
    return (data ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  },

  async create(
    client: RepositoryClient,
    input: Omit<OrderPayment, "id" | "created_at">
  ) {
    const { data, error } = await client
      .from("order_payments")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as OrderPayment;
  },
};
