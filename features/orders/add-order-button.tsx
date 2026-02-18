"use client";

import { useAddSheet } from "@/features/add/add-sheet-context";
import { Button } from "@/components/ui/button";

export function AddOrderButtonNav() {
  const { openAdd } = useAddSheet();

  return (
    <Button onClick={() => openAdd("order")} className="w-full sm:w-auto">
      Nouvelle commande
    </Button>
  );
}
