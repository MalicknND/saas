"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/types/database";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  preparing: "En préparation",
  delivered: "Livré",
};

const paymentLabels: Record<string, string> = {
  unpaid: "Non payé",
  deposit: "Acompte",
  paid: "Payé",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement…" : "Enregistrer"}
    </Button>
  );
}

interface OrderFormProps {
  customers: Customer[];
  defaultCustomerId?: string;
}

export function OrderForm({ customers, defaultCustomerId }: OrderFormProps) {
  const [state, formAction] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await createOrder(formData);
    return result;
  }, null);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customer_id">Client</Label>
        <select
          id="customer_id"
          name="customer_id"
          required
          defaultValue={defaultCustomerId}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Choisir un client</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.error?.customer_id && (
          <p className="text-sm text-destructive">{state.error.customer_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="items">Articles</Label>
        <Input
          id="items"
          name="items"
          placeholder="Ex: 3 tartes citron, 2 quiches"
          required
        />
        {state?.error?.items && (
          <p className="text-sm text-destructive">{state.error.items[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_price">Prix total (€)</Label>
        <Input
          id="total_price"
          name="total_price"
          type="number"
          step="0.01"
          min="0"
          required
        />
        {state?.error?.total_price && (
          <p className="text-sm text-destructive">{state.error.total_price[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_date">Date de livraison</Label>
        <Input id="delivery_date" name="delivery_date" type="date" defaultValue={today} required />
        {state?.error?.delivery_date && (
          <p className="text-sm text-destructive">{state.error.delivery_date[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <select
            id="status"
            name="status"
            defaultValue="pending"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.entries(statusLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_status">Paiement</Label>
          <select
            id="payment_status"
            name="payment_status"
            defaultValue="unpaid"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.entries(paymentLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Note (optionnel)</Label>
        <Input id="notes" name="notes" placeholder="..." />
      </div>

      <SubmitButton />
      {state?.success && <p className="text-sm text-[hsl(var(--profit))]">Commande enregistrée.</p>}
    </form>
  );
}
