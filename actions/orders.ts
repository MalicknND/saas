"use server";

import { revalidatePath } from "next/cache";
import { createOrderSchema, orderPaymentSchema, updateOrderSchema } from "@/validators/order.schema";
import * as orderService from "@/services/order.service";

export async function createOrder(formData: FormData) {
  const parsed = createOrderSchema.safeParse({
    customer_id: formData.get("customer_id") || undefined,
    customer_name: formData.get("customer_name")?.toString().trim() || undefined,
    customer_phone: formData.get("phone")?.toString().trim() || undefined,
    items: formData.get("items"),
    total_price: formData.get("total_price"),
    delivery_date: formData.get("delivery_date"),
    status: formData.get("status") ?? "pending",
    payment_status: formData.get("payment_status") ?? "unpaid",
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await orderService.createOrder(parsed.data);
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/add-order");
  return { success: true };
}

export async function updateOrder(id: string, formData: FormData) {
  const parsed = updateOrderSchema.safeParse({
    status: formData.get("status"),
    payment_status: formData.get("payment_status"),
    items: formData.get("items"),
    total_price: formData.get("total_price"),
    delivery_date: formData.get("delivery_date"),
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await orderService.updateOrder(id, parsed.data);
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  return { success: true };
}

export async function deleteOrder(id: string) {
  await orderService.deleteOrder(id);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateOrderStatus(
  id: string,
  updates: { status?: "pending" | "preparing" | "delivered"; payment_status?: "unpaid" | "deposit" | "paid" }
) {
  await orderService.updateOrder(id, updates);
  revalidatePath("/today");
  revalidatePath(`/order/${id}`);
  return { success: true };
}

export async function addOrderPayment(formData: FormData) {
  const parsed = orderPaymentSchema.safeParse({
    order_id: formData.get("order_id"),
    amount: formData.get("amount"),
    paid_at: formData.get("paid_at"),
    note: formData.get("note") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await orderService.addPayment(parsed.data);
  revalidatePath("/orders");
  revalidatePath(`/orders/${parsed.data.order_id}`);
  return { success: true };
}
