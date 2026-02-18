"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { markCustomerPaid } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface MarkPaidButtonProps {
  customerId: string;
  customerName: string;
}

export function MarkPaidButton({ customerId, customerName }: MarkPaidButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Tout marquer payé pour ${customerName} ?`)) return;
    startTransition(async () => {
      const result = await markCustomerPaid(customerId);
      if (result?.error) {
        toast.error(Object.values(result.error).flat().join(" "));
      } else {
        toast.success("Tout marqué payé");
      }
    });
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="flex-1 rounded-xl"
    >
      <CheckCircle className="mr-2 h-4 w-4" />
      Tout marquer payé
    </Button>
  );
}
