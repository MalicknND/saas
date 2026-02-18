"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCustomer } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement…" : "Enregistrer"}
    </Button>
  );
}

export function CustomerForm() {
  const [state, formAction] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await createCustomer(formData);
    return result;
  }, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" placeholder="Jean Dupont" required />
        {state?.error?.name && (
          <p className="text-sm text-destructive">{state.error.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone (optionnel)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="06 12 34 56 78" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Input id="notes" name="notes" placeholder="Allergies, préférences..." />
      </div>

      <SubmitButton />
      {state?.success && <p className="text-sm text-[hsl(var(--profit))]">Client ajouté.</p>}
    </form>
  );
}
