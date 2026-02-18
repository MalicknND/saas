"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/types/database";

const paymentOptions = [
  { value: "unpaid", label: "Impayé" },
  { value: "deposit", label: "Acompte" },
  { value: "paid", label: "Payé" },
];

const statusOptions = [
  { value: "pending", label: "En attente" },
  { value: "preparing", label: "En prépa" },
  { value: "delivered", label: "Livré" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full min-h-[52px] text-base font-semibold rounded-xl">
      {pending ? "Enregistrement…" : "Valider"}
    </Button>
  );
}

interface OrderFormFullProps {
  customers: Customer[];
}

export function OrderFormFull({ customers }: OrderFormFullProps) {
  const [state, formAction] = useActionState(async (_: unknown, formData: FormData) => {
    return await createOrder(formData);
  }, null);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customer_name">Nom du client</Label>
        <Input
          id="customer_name"
          name="customer_name"
          placeholder="Ex: Marie"
          list="customers-list"
          className="min-h-[48px] rounded-xl text-base"
        />
        <datalist id="customers-list">
          {customers.map((c) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone (optionnel)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="06 12 34 56 78"
          className="min-h-[48px] rounded-xl text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="items">Articles</Label>
        <Input
          id="items"
          name="items"
          placeholder="3 tartes citron, 2 quiches"
          required
          className="min-h-[48px] rounded-xl text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_price">Prix total (DH)</Label>
        <Input
          id="total_price"
          name="total_price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          required
          className="min-h-[48px] rounded-xl text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_date">Date de livraison</Label>
        <Input
          id="delivery_date"
          name="delivery_date"
          type="date"
          defaultValue={today}
          required
          className="min-h-[48px] rounded-xl text-base"
        />
      </div>

      <div className="space-y-3">
        <Label>Statut paiement</Label>
        <div className="flex gap-2 flex-wrap">
          {paymentOptions.map((opt) => (
            <label key={opt.value} className="flex-1 min-w-[90px]">
              <input type="radio" name="payment_status" value={opt.value} defaultChecked={opt.value === "unpaid"} className="peer sr-only" />
              <span className="flex min-h-[48px] items-center justify-center rounded-xl border-2 border-border bg-card px-4 font-medium peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Statut commande</Label>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <label key={opt.value} className="flex-1 min-w-[90px]">
              <input type="radio" name="status" value={opt.value} defaultChecked={opt.value === "pending"} className="peer sr-only" />
              <span className="flex min-h-[48px] items-center justify-center rounded-xl border-2 border-border bg-card px-4 font-medium peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <SubmitButton />
      {state?.error && (
        <p className="text-sm text-destructive">{Object.values(state.error).flat().join(" ")}</p>
      )}
      {state?.success && (
        <p className="text-sm text-[hsl(var(--profit))]">Commande enregistrée.</p>
      )}
    </form>
  );
}
