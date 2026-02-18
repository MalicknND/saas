/**
 * Service optimisé pour Today — une seule requête Supabase (RPC get_dashboard_today).
 * Fallback sur les 3 services classiques si la migration n'est pas appliquée.
 */
import { requireWorkspace } from "./workspace.service";
import { getDailySummary } from "./summary.service";
import { listOrders } from "./order.service";
import { listCustomersWithDebt } from "./debt.service";
import type { TodaySummary } from "./summary.service";

export interface TodayOrder {
  id: string;
  items: string;
  total_price: number;
  delivery_date: string;
  status: string;
  payment_status: string;
  customer_id: string;
  customer: { id: string; name: string } | null;
}

export interface TodayDashboardData {
  summary: TodaySummary;
  orders: TodayOrder[];
  debts: { total: number; count: number };
}

export async function getTodayDashboard(date: string): Promise<TodayDashboardData> {
  const { supabase, workspaceId } = await requireWorkspace();

  const { data, error } = await supabase.rpc("get_dashboard_today", {
    p_workspace_id: workspaceId,
    p_date: date,
  });

  if (error?.code === "42883") {
    // Function does not exist (migration pas appliquée) → fallback
    return getTodayDashboardFallback(date);
  }
  if (error) throw error;

  const raw = data as {
    summary: { income: number; expenses: number; profit: number };
    orders: Array<{
      id: string;
      items: string;
      total_price: number;
      delivery_date: string;
      status: string;
      payment_status: string;
      customer_id: string;
      customer: { id: string; name: string } | null;
    }>;
    debts: { total: number; count: number };
  };

  return {
    summary: {
      income: raw.summary.income,
      expenses: raw.summary.expenses,
      profit: raw.summary.profit,
    },
    orders: raw.orders,
    debts: raw.debts,
  };
}

async function getTodayDashboardFallback(date: string): Promise<TodayDashboardData> {
  const [summary, orders, debtsData] = await Promise.all([
    getDailySummary(date),
    listOrders({ deliveryDate: date }),
    listCustomersWithDebt().then((d) => ({
      total: d.reduce((s, x) => s + x.debt, 0),
      count: d.length,
    })),
  ]);

  return {
    summary,
    orders,
    debts: debtsData,
  };
}
