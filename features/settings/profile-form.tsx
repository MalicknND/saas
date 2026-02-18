"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  initialFullName: string;
};

export function ProfileForm({ initialFullName }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    const result = await updateProfile(formData);
    if (result.error) setError(result.error);
    if (result.success) setSuccess(result.success);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nom complet</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={initialFullName}
          placeholder="Marie Dupont"
          required
          autoComplete="name"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      <Button type="submit" variant="outline" size="sm">
        Enregistrer
      </Button>
    </form>
  );
}
