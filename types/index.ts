export * from "./database";

import type { Customer } from "./database";

/** Computed/joined types used in the app */
export interface CustomerWithDebt extends Customer {
  total_orders: number;
  total_paid: number;
  debt: number;
}

export interface DailySummary {
  date: string;
  income: number;
  expenses: number;
  profit: number;
}
