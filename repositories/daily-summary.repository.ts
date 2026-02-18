/**
 * Repository for daily aggregates.
 * Uses efficient date-range queries - no full table scans.
 */
import type { RepositoryClient } from "./base";
import type { DailySummary } from "@/types";

export const dailySummaryRepository = {
  /**
   * Get income (sum of order_payments) per day for a date range.
   * Groups by paid_at for efficiency.
   */
  async getIncomeByDateRange(
    client: RepositoryClient,
    workspaceId: string,
    fromDate: string,
    toDate: string
  ): Promise<{ date: string; income: number }[]> {
    const { data, error } = await client.rpc("get_daily_income", {
      p_workspace_id: workspaceId,
      p_from: fromDate,
      p_to: toDate,
    });

    // Fallback if RPC doesn't exist: use raw query via select
    if (error?.code === "42883") {
      // function does not exist
      return this.getIncomeByDateRangeFallback(client, workspaceId, fromDate, toDate);
    }
    if (error) throw error;
    return (data ?? []) as { date: string; income: number }[];
  },

  async getIncomeByDateRangeFallback(
    client: RepositoryClient,
    workspaceId: string,
    fromDate: string,
    toDate: string
  ): Promise<{ date: string; income: number }[]> {
    const { data, error } = await client
      .from("order_payments")
      .select("paid_at, amount")
      .eq("workspace_id", workspaceId)
      .gte("paid_at", fromDate)
      .lte("paid_at", toDate);

    if (error) throw error;

    // Group by date in memory (fallback when no RPC)
    const byDate = new Map<string, number>();
    for (const row of data ?? []) {
      const d = String(row.paid_at);
      byDate.set(d, (byDate.get(d) ?? 0) + Number(row.amount));
    }
    return Array.from(byDate.entries()).map(([date, income]) => ({ date, income }));
  },

  async getExpensesByDateRange(
    client: RepositoryClient,
    workspaceId: string,
    fromDate: string,
    toDate: string
  ): Promise<{ date: string; expenses: number }[]> {
    const { data, error } = await client
      .from("expenses")
      .select("date, amount")
      .eq("workspace_id", workspaceId)
      .gte("date", fromDate)
      .lte("date", toDate);

    if (error) throw error;

    const byDate = new Map<string, number>();
    for (const row of data ?? []) {
      const d = String(row.date);
      byDate.set(d, (byDate.get(d) ?? 0) + Number(row.amount));
    }
    return Array.from(byDate.entries()).map(([date, expenses]) => ({ date, expenses }));
  },

  /** Build daily summaries for a date range */
  async getDailySummaries(
    client: RepositoryClient,
    workspaceId: string,
    fromDate: string,
    toDate: string
  ): Promise<DailySummary[]> {
    const [incomeRows, expenseRows] = await Promise.all([
      dailySummaryRepository.getIncomeByDateRangeFallback(
        client,
        workspaceId,
        fromDate,
        toDate
      ),
      dailySummaryRepository.getExpensesByDateRange(client, workspaceId, fromDate, toDate),
    ]);

    const incomeMap = new Map(incomeRows.map((r) => [r.date, r.income]));
    const expenseMap = new Map(expenseRows.map((r) => [r.date, r.expenses]));

    const dates = new Set([...incomeMap.keys(), ...expenseMap.keys()]);
    const result: DailySummary[] = [];
    for (const date of Array.from(dates).sort()) {
      const income = incomeMap.get(date) ?? 0;
      const expenses = expenseMap.get(date) ?? 0;
      result.push({ date, income, expenses, profit: income - expenses });
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  },
};
