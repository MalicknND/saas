"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import type { OrderStatus, PaymentStatus } from "@/types/database";

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  preparing: "En préparation",
  delivered: "Livré",
};

const paymentLabels: Record<PaymentStatus, string> = {
  unpaid: "Non payé",
  deposit: "Acompte",
  paid: "Payé",
};

interface OrderStatusFormProps {
  orderId: string;
  initialStatus: OrderStatus;
  initialPaymentStatus: PaymentStatus;
}

export function OrderStatusForm({ orderId, initialStatus, initialPaymentStatus }: OrderStatusFormProps) {
  const [isPending, startTransition] = useTransition();

  const update = (field: "status" | "payment_status", value: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, { [field]: value });
    });
  };

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Statut</p>
        <div className="flex gap-1">
          {(Object.entries(statusLabels) as [OrderStatus, string][]).map(([v, l]) => (
            <Button
              key={v}
              variant={initialStatus === v ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => update("status", v)}
            >
              {l}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Paiement</p>
        <div className="flex gap-1">
          {(Object.entries(paymentLabels) as [PaymentStatus, string][]).map(([v, l]) => (
            <Button
              key={v}
              variant={initialPaymentStatus === v ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => update("payment_status", v)}
            >
              {l}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
