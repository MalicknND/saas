"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/types/database";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Enregistrement…" : "Enregistrer"}
    </Button>
  );
}

interface OrderFormQuickProps {
  customers: Customer[];
}

export function OrderFormQuick({ customers }: OrderFormQuickProps) {
  const [state, formAction] = useActionState(async (_prev: unknown, formData: FormData) => {
    return await createOrder(formData);
  }, null);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customer_name">Client</Label>
        <Input
          id="customer_name"
          name="customer_name"
          placeholder="Ex: Marie, Instagram @tartes"
          list="customers-list"
        />
        <datalist id="customers-list">
          {customers.map((c) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
        <p className="text-xs text-muted-foreground">Tapez pour créer ou choisir</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="items">Articles</Label>
        <Input id="items" name="items" placeholder="3 tartes citron, 2 quiches" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_price">Prix total (€)</Label>
        <Input
          id="total_price"
          name="total_price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          required
        />
      </div>

      <input type="hidden" name="delivery_date" value={today} />
      <input type="hidden" name="status" value="pending" />
      <input type="hidden" name="payment_status" value="unpaid" />

      <SubmitButton />
      {state?.error && (
        <p className="text-sm text-destructive">
          {Object.values(state.error).flat().join(" ")}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-[hsl(var(--profit))]">Commande enregistrée.</p>
      )}
    </form>
  );
}
