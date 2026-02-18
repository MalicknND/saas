"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addOrderPayment } from "@/actions/orders";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "..." : "Ajouter paiement"}
    </Button>
  );
}

interface OrderPaymentFormProps {
  orderId: string;
}

export function OrderPaymentForm({ orderId }: OrderPaymentFormProps) {
  const [state, formAction] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await addOrderPayment(formData);
    return result;
  }, null);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-wrap gap-2 items-end">
      <input type="hidden" name="order_id" value={orderId} />
      <div className="space-y-1">
        <Label htmlFor="amount" className="text-xs">Montant</Label>
        <Input id="amount" name="amount" type="number" step="0.01" min="0.01" placeholder="0" className="w-24" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="paid_at" className="text-xs">Date</Label>
        <Input id="paid_at" name="paid_at" type="date" defaultValue={today} className="w-36" required />
      </div>
      <SubmitButton />
    </form>
  );
}
