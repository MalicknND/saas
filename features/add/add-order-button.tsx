"use client";

import { useAddSheet } from "./add-sheet-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddOrderButton() {
  const { openAdd } = useAddSheet();

  return (
    <Button
      size="lg"
      className="min-h-[48px]"
      onClick={() => openAdd("order")}
    >
      <Plus className="mr-2 h-5 w-5" />
      Ajouter une commande
    </Button>
  );
}
