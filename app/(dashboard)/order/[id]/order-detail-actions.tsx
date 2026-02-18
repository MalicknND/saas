"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/orders";
import type { OrderStatus, PaymentStatus } from "@/types/database";

const paymentOptions: { value: PaymentStatus; label: string }[] = [
  { value: "unpaid", label: "Impayé" },
  { value: "deposit", label: "Acompte" },
  { value: "paid", label: "Payé" },
];

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "preparing", label: "En prépa" },
  { value: "delivered", label: "Livré" },
];

interface OrderDetailActionsProps {
  orderId: string;
  currentPaymentStatus: PaymentStatus;
  currentStatus: OrderStatus;
}

export function OrderDetailActions({ orderId, currentPaymentStatus, currentStatus }: OrderDetailActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {paymentOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              startTransition(async () => {
                const result = await updateOrderStatus(orderId, { payment_status: opt.value });
                if (result?.error) toast.error(Object.values(result.error).flat().join(" "));
              });
            }}
            disabled={isPending}
            className={`min-h-[44px] px-4 rounded-xl font-medium border-2 transition-colors ${
              currentPaymentStatus === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Statut commande</p>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                startTransition(async () => {
                  const result = await updateOrderStatus(orderId, { status: opt.value });
                  if (result?.error) toast.error(Object.values(result.error).flat().join(" "));
                });
              }}
              disabled={isPending}
              className={`min-h-[44px] px-4 rounded-xl font-medium border-2 transition-colors ${
                currentStatus === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
