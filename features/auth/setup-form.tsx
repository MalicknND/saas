"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createWorkspaceFromForm } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Création…" : "Créer mon espace"}
    </Button>
  );
}

export function SetupForm() {
  const [state, formAction] = useActionState(async (_: unknown, formData: FormData) => {
    return await createWorkspaceFromForm(formData);
  }, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nom de votre activité</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ex: Ma petite cuisine, Les tartes de Marie...
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" placeholder="Mon activité" required />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{Object.values(state.error).flat().join(" ")}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
