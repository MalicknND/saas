"use client";

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
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "…" : "Enregistrer"}
    </Button>
  );
}

export function ExpenseFormQuick() {
  const [state, formAction] = useActionState(async (_prev: unknown, formData: FormData) => {
    return await createExpense(formData);
  }, null);

  const today = new Date().toISOString().slice(0, 10);

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
          placeholder="0"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          name="category"
          required
          defaultValue="ingredients"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {expenseCategories.map((cat) => (
            <option key={cat} value={cat}>{expenseCategoryLabels[cat]}</option>
          ))}
        </select>
      </div>

      <input type="hidden" name="date" value={today} />

      <SubmitButton />
      {state?.error && (
        <p className="text-sm text-destructive">
          {Object.values(state.error).flat().join(" ")}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-[hsl(var(--profit))]">Dépense enregistrée.</p>
      )}
    </form>
  );
}
