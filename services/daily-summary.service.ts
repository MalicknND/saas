import { requireWorkspace } from "./workspace.service";
import { dailySummaryRepository } from "@/repositories/daily-summary.repository";
import type { DailySummary } from "@/types";

export async function getDailySummaries(fromDate: string, toDate: string): Promise<DailySummary[]> {
  const { supabase, workspaceId } = await requireWorkspace();
  return dailySummaryRepository.getDailySummaries(supabase, workspaceId, fromDate, toDate);
}
