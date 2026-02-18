import type { RepositoryClient } from "./base";
import type { Expense, ExpenseCategory } from "@/types/database";

export const expenseRepository = {
  async listByWorkspace(
    client: RepositoryClient,
    workspaceId: string,
    options?: { fromDate?: string; toDate?: string; category?: ExpenseCategory }
  ) {
    let query = client
      .from("expenses")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("date", { ascending: false });

    if (options?.fromDate) {
      query = query.gte("date", options.fromDate);
    }
    if (options?.toDate) {
      query = query.lte("date", options.toDate);
    }
    if (options?.category) {
      query = query.eq("category", options.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Expense[];
  },

  async getById(client: RepositoryClient, id: string, workspaceId: string) {
    const { data, error } = await client
      .from("expenses")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) throw error;
    return data as Expense;
  },

  async create(client: RepositoryClient, input: Omit<Expense, "id" | "created_at" | "updated_at">) {
    const { data, error } = await client
      .from("expenses")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Expense;
  },

  async update(
    client: RepositoryClient,
    id: string,
    workspaceId: string,
    input: Partial<Pick<Expense, "amount" | "category" | "note" | "date">>
  ) {
    const { data, error } = await client
      .from("expenses")
      .update(input)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data as Expense;
  },

  async delete(client: RepositoryClient, id: string, workspaceId: string) {
    const { error } = await client
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
  },

  /** Sum expenses for a given date range - efficient for daily summary */
  async sumByDateRange(
    client: RepositoryClient,
    workspaceId: string,
    fromDate: string,
    toDate: string
  ): Promise<number> {
    const { data, error } = await client
      .from("expenses")
      .select("amount")
      .eq("workspace_id", workspaceId)
      .gte("date", fromDate)
      .lte("date", toDate);

    if (error) throw error;
    return (data ?? []).reduce((sum, r) => sum + Number(r.amount), 0);
  },
};
