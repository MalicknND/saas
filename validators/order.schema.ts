import { z } from "zod";

export const createOrderSchema = z
  .object({
    customer_id: z.string().uuid().optional(),
    customer_name: z.string().max(200).optional(),
    customer_phone: z.string().max(30).optional(),
    items: z.string().min(1, "Articles requis").max(2000),
    total_price: z.coerce.number().nonnegative("Prix positif"),
    delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date AAAA-MM-JJ"),
    status: z.enum(["pending", "preparing", "delivered"]).default("pending"),
    payment_status: z.enum(["unpaid", "deposit", "paid"]).default("unpaid"),
    notes: z.string().max(500).optional().nullable(),
  })
  .refine(
    (d) => d.customer_id || (d.customer_name && d.customer_name.trim().length > 0),
    { message: "Indiquez un client (sélectionnez ou tapez le nom)", path: ["customer_id"] }
  );

export const orderPaymentSchema = z.object({
  order_id: z.string().uuid(),
  amount: z.coerce.number().positive("Montant positif"),
  paid_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(200).optional().nullable(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "preparing", "delivered"]).optional(),
  payment_status: z.enum(["unpaid", "deposit", "paid"]).optional(),
  items: z.string().min(1).max(2000).optional(),
  total_price: z.coerce.number().nonnegative().optional(),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().max(500).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
