import type { ExpenseCategory } from "@/types/database";

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  ingredients: "Ingrédients",
  packaging: "Emballage",
  transport: "Transport",
  equipment: "Équipement",
  other: "Autre",
};
