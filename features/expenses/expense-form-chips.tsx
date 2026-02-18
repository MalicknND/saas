"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createExpense } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories = [
  { value: "ingredients", label: "Ingrédients" },
  { value: "packaging", label: "Emballage" },
  { value: "transport", label: "Livraison" },
  { value: "equipment", label: "Gaz" },
  { value: "other", label: "Autre" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full min-h-[52px] text-base font-semibold rounded-xl">
      {pending ? "…" : "Enregistrer"}
    </Button>
  );
}

export function ExpenseFormChips() {
  const [state, formAction] = useActionState(async (_: unknown, formData: FormData) => {
    return await createExpense(formData);
  }, null);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-center block">Montant</Label>
        <div className="relative">
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            required
            className="min-h-[72px] text-3xl text-center font-bold rounded-xl"
            autoFocus
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground">
            €
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Catégorie</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex-1 min-w-[100px]">
              <input type="radio" name="category" value={cat.value} defaultChecked={cat.value === "ingredients"} className="peer sr-only" />
              <span className="flex min-h-[48px] items-center justify-center rounded-xl border-2 border-border bg-card px-4 font-medium peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground transition-colors">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optionnel)</Label>
        <Input
          id="note"
          name="note"
          placeholder="Détails..."
          className="min-h-[48px] rounded-xl text-base"
        />
      </div>

      <input type="hidden" name="date" value={today} />

      <SubmitButton />
      {state?.error && (
        <p className="text-sm text-destructive">{Object.values(state.error).flat().join(" ")}</p>
      )}
      {state?.success && (
        <p className="text-sm text-[hsl(var(--profit))]">Dépense enregistrée.</p>
      )}
    </form>
  );
}
