"use client";

import { deleteExpense } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

interface ExpenseActionsProps {
  expenseId: string;
}

export function ExpenseActions({ expenseId }: ExpenseActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Supprimer cette dépense ?")) return;
    startTransition(async () => {
      await deleteExpense(expenseId);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
