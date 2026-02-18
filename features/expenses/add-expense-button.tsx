"use client";

import { useAddSheet } from "@/features/add/add-sheet-context";
import { Button } from "@/components/ui/button";

export function AddExpenseButton() {
  const { openAdd } = useAddSheet();

  return (
    <Button onClick={() => openAdd("expense")}>
      Ajouter une dépense
    </Button>
  );
}
