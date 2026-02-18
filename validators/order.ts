import { z } from "zod";

export const orderSchema = z.object({
  customer_id: z.string().uuid("Client invalide"),
  items: z.string().min(1, "Décrivez les articles").max(2000),
  total_price: z.coerce.number().nonnegative("Le prix doit être positif"),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format date: AAAA-MM-JJ"),
  status: z.enum(["pending", "preparing", "delivered"]),
  payment_status: z.enum(["unpaid", "deposit", "paid"]),
  notes: z.string().max(500).optional().nullable(),
});

export const orderPaymentSchema = z.object({
  order_id: z.string().uuid(),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  paid_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format date: AAAA-MM-JJ"),
  note: z.string().max(200).optional().nullable(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderPaymentFormData = z.infer<typeof orderPaymentSchema>;
