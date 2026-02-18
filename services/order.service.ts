import { requireWorkspace } from "./workspace.service";
import { orderRepository, orderPaymentRepository } from "@/repositories/order.repository";
import { customerRepository } from "@/repositories/customer.repository";
import type { Order, OrderPayment, PaymentStatus } from "@/types/database";

export async function listOrders(options?: { deliveryDate?: string; customerId?: string }) {
  const { supabase, workspaceId } = await requireWorkspace();
  const orders = await orderRepository.listByWorkspace(supabase, workspaceId, options);

  if (orders.length === 0) return [];

  const customerIds = [...new Set(orders.map((o) => o.customer_id))];
  const customers = await customerRepository.listByWorkspace(supabase, workspaceId);
  const customerMap = new Map(customers.map((c) => [c.id, c]));

  return orders.map((order) => ({
    ...order,
    customer: customerMap.get(order.customer_id) ?? null,
  }));
}

export async function getOrder(id: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  const order = await orderRepository.getById(supabase, id, workspaceId);
  const [customer, payments] = await Promise.all([
    customerRepository.getById(supabase, order.customer_id, workspaceId),
    orderPaymentRepository.listByOrder(supabase, id, workspaceId),
  ]);
  const totalPaid = await orderPaymentRepository.getTotalPaid(supabase, id);
  return { order, customer, payments, totalPaid, remaining: order.total_price - totalPaid };
}

export async function createOrder(input: {
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  items: string;
  total_price: number;
  delivery_date: string;
  status: "pending" | "preparing" | "delivered";
  payment_status: PaymentStatus;
  notes?: string | null;
}) {
  const { supabase, workspaceId } = await requireWorkspace();

  let customerId: string;
  if (input.customer_id) {
    customerId = input.customer_id;
  } else if (input.customer_name?.trim()) {
    const existing = await customerRepository.findByName(supabase, workspaceId, input.customer_name);
    if (existing) {
      customerId = existing.id;
    } else {
      const created = await customerRepository.create(supabase, {
        workspace_id: workspaceId,
        name: input.customer_name.trim(),
        phone: input.customer_phone?.trim() || null,
        notes: null,
      });
      customerId = created.id;
    }
  } else {
    throw new Error("Client requis");
  }

  return orderRepository.create(supabase, {
    workspace_id: workspaceId,
    customer_id: customerId,
    items: input.items,
    total_price: input.total_price,
    delivery_date: input.delivery_date,
    status: input.status,
    payment_status: input.payment_status,
    notes: input.notes ?? null,
  });
}

export async function updateOrder(
  id: string,
  input: Partial<{ status: "pending" | "preparing" | "delivered"; payment_status: PaymentStatus; items: string; total_price: number; delivery_date: string; notes: string | null }>
) {
  const { supabase, workspaceId } = await requireWorkspace();
  return orderRepository.update(supabase, id, workspaceId, input);
}

export async function deleteOrder(id: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  return orderRepository.delete(supabase, id, workspaceId);
}

export async function addPayment(input: { order_id: string; amount: number; paid_at: string; note?: string | null }) {
  const { supabase, workspaceId } = await requireWorkspace();
  const payment = await orderPaymentRepository.create(supabase, {
    order_id: input.order_id,
    amount: input.amount,
    paid_at: input.paid_at,
    note: input.note ?? null,
    workspace_id: workspaceId,
  });

  // Update order payment_status
  const totalPaid = await orderPaymentRepository.getTotalPaid(supabase, input.order_id);
  const order = await orderRepository.getById(supabase, input.order_id, workspaceId);
  let status: PaymentStatus = totalPaid >= order.total_price ? "paid" : totalPaid > 0 ? "deposit" : "unpaid";
  await orderRepository.update(supabase, input.order_id, workspaceId, { payment_status: status });

  return payment;
}
