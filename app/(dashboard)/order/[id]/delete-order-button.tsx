"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface DeleteOrderButtonProps {
  orderId: string;
}

export function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Supprimer cette commande ?")) return;
    startTransition(async () => {
      await deleteOrder(orderId);
      router.push("/today");
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Supprimer la commande
    </Button>
  );
}
