import { z } from "zod";
import { expenseCategories } from "@/types/database";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Le montant doit être positif"),
  category: z.enum(expenseCategories),
  note: z.string().max(500).optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format date: AAAA-MM-JJ"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
