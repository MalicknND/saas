/**
 * Database types - mirror of Supabase schema.
 * Used for type-safe repository operations.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ExpenseCategory =
  | "ingredients"
  | "packaging"
  | "transport"
  | "equipment"
  | "other";

export const expenseCategories: [ExpenseCategory, ...ExpenseCategory[]] = [
  "ingredients",
  "packaging",
  "transport",
  "equipment",
  "other",
];

export type OrderStatus = "pending" | "preparing" | "delivered";

export type PaymentStatus = "unpaid" | "deposit" | "paid";

// --- Supabase generated types (conceptual) ---

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: "owner" | "member";
  created_at: string;
}

export interface Customer {
  id: string;
  workspace_id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  workspace_id: string;
  customer_id: string;
  items: string;
  total_price: number;
  delivery_date: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderPayment {
  id: string;
  workspace_id: string;
  order_id: string;
  amount: number;
  paid_at: string;
  note: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  workspace_id: string;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}
