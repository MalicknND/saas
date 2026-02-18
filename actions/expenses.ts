"use server";

import { revalidatePath } from "next/cache";
import { expenseSchema } from "@/validators/expense";
import * as expenseService from "@/services/expense.service";

export async function createExpense(formData: FormData) {
  const parsed = expenseSchema.safeParse({
    amount: formData.get("amount"),
    category: formData.get("category"),
    note: formData.get("note") || null,
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await expenseService.createExpense(parsed.data);
  revalidatePath("/today");
  revalidatePath("/expenses");
  return { success: true };
}

export async function updateExpense(id: string, formData: FormData) {
  const parsed = expenseSchema.safeParse({
    amount: formData.get("amount"),
    category: formData.get("category"),
    note: formData.get("note") || null,
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await expenseService.updateExpense(id, parsed.data);
  revalidatePath("/expenses");
  revalidatePath(`/expenses/${id}`);
  return { success: true };
}

export async function deleteExpense(id: string) {
  await expenseService.deleteExpense(id);
  revalidatePath("/today");
  revalidatePath("/expenses");
  return { success: true };
}
