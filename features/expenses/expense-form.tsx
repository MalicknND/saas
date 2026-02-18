"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createExpense } from "@/actions/expenses";
import { expenseCategories } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { expenseCategoryLabels } from "./utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement…" : "Enregistrer"}
    </Button>
  );
}

interface ExpenseFormProps {
  onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps = {}) {
  const [state, formAction] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await createExpense(formData);
    return result;
  }, null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.success && onSuccess) onSuccess();
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Montant (€)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          required
        />
        {state?.error && "amount" in state.error && state.error.amount?.[0] && (
          <p className="text-sm text-destructive">{state.error.amount[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          name="category"
          required
          defaultValue="ingredients"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expenseCategories.map((cat) => (
            <option key={cat} value={cat}>
              {expenseCategoryLabels[cat]}
            </option>
          ))}
        </select>
        {state?.error && "category" in state.error && state.error.category?.[0] && (
          <p className="text-sm text-destructive">{state.error.category[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" defaultValue={today} required />
        {state?.error && "date" in state.error && state.error.date?.[0] && (
          <p className="text-sm text-destructive">{state.error.date[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optionnel)</Label>
        <Input id="note" name="note" placeholder="Détails..." />
      </div>

      <SubmitButton />
      {state?.success && <p className="text-sm text-[hsl(var(--profit))]">Dépense enregistrée.</p>}
    </form>
  );
}
