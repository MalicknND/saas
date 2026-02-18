"use client";

import { useState } from "react";
import { updatePassword } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    const result = await updatePassword(formData);
    if (result.error) setError(result.error);
    if (result.success) setSuccess(result.success);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new_password">Nouveau mot de passe</Label>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      <Button type="submit" variant="outline" size="sm">
        Changer le mot de passe
      </Button>
    </form>
  );
}
