/**
 * Service critique n°1 — Résumé du jour
 * profit = paiements reçus - dépenses (argent encaissé, PAS total commandes)
 */
import { requireWorkspace } from "./workspace.service";
import { dailySummaryRepository } from "@/repositories/daily-summary.repository";

export interface TodaySummary {
  income: number;   // Entrées = paiements reçus aujourd'hui
  expenses: number; // Sorties = dépenses aujourd'hui
  profit: number;   // Bénéfice = income - expenses
}

export async function getDailySummary(date: string): Promise<TodaySummary> {
  const { supabase, workspaceId } = await requireWorkspace();
  const summaries = await dailySummaryRepository.getDailySummaries(
    supabase,
    workspaceId,
    date,
    date
  );
  const s = summaries[0];
  if (!s) return { income: 0, expenses: 0, profit: 0 };
  return { income: s.income, expenses: s.expenses, profit: s.profit };
}
