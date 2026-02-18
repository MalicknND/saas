"use client";

import { useState } from "react";
import { deleteAccount } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const CONFIRM_TEXT = "SUPPRIMER";

export function DeleteAccountButton() {
  const [step, setStep] = useState<"idle" | "confirm">("idle");
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isConfirmValid = confirmValue === CONFIRM_TEXT;

  async function handleDelete() {
    if (!isConfirmValid) return;
    setError(null);
    const result = await deleteAccount();
    if (result?.error) setError(result.error);
  }

  return (
    <div className="space-y-4">
      {step === "idle" ? (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => setStep("confirm")}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </Button>
      ) : (
        <div className="space-y-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Toutes vos données seront supprimées. Tapez{" "}
            <strong>{CONFIRM_TEXT}</strong> pour confirmer.
          </p>
          <div className="space-y-2">
            <Label htmlFor="confirm_delete">Confirmation</Label>
            <Input
              id="confirm_delete"
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value.toUpperCase())}
              placeholder={CONFIRM_TEXT}
              className="font-mono uppercase"
              autoComplete="off"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={!isConfirmValid}
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer définitivement
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setStep("idle");
                setConfirmValue("");
                setError(null);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
