import { requireWorkspace } from "./workspace.service";
import { expenseRepository } from "@/repositories/expense.repository";
import type { Expense, ExpenseCategory } from "@/types/database";

export async function listExpenses(options?: { fromDate?: string; toDate?: string; category?: ExpenseCategory }) {
  const { supabase, workspaceId } = await requireWorkspace();
  return expenseRepository.listByWorkspace(supabase, workspaceId, options);
}

export async function getExpense(id: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  return expenseRepository.getById(supabase, id, workspaceId);
}

export async function createExpense(input: { amount: number; category: ExpenseCategory; note?: string | null; date: string }) {
  const { supabase, workspaceId } = await requireWorkspace();
  return expenseRepository.create(supabase, {
    workspace_id: workspaceId,
    amount: input.amount,
    category: input.category,
    note: input.note ?? null,
    date: input.date,
  });
}

export async function updateExpense(
  id: string,
  input: Partial<{ amount: number; category: ExpenseCategory; note: string | null; date: string }>
) {
  const { supabase, workspaceId } = await requireWorkspace();
  return expenseRepository.update(supabase, id, workspaceId, input);
}

export async function deleteExpense(id: string) {
  const { supabase, workspaceId } = await requireWorkspace();
  return expenseRepository.delete(supabase, id, workspaceId);
}
