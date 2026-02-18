"use server";

import { revalidatePath } from "next/cache";
import { customerSchema } from "@/validators/customer";
import * as customerService from "@/services/customer.service";
import * as debtService from "@/services/debt.service";

export async function createCustomer(formData: FormData) {
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || null,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await customerService.createCustomer(parsed.data);
  revalidatePath("/customers");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCustomer(id: string, formData: FormData) {
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || null,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await customerService.updateCustomer(id, parsed.data);
  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  return { success: true };
}

export async function deleteCustomer(id: string) {
  await customerService.deleteCustomer(id);
  revalidatePath("/customers");
  revalidatePath("/today");
  return { success: true };
}

export async function markCustomerPaid(customerId: string) {
  await debtService.markCustomerPaid(customerId);
  revalidatePath("/customers");
  revalidatePath("/today");
  return { success: true };
}
