import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(200),
  phone: z.string().max(30).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
