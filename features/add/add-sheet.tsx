"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OrderFormFull } from "@/features/orders/order-form-full";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { listCustomersForForm } from "@/actions/customers";
import type { Customer } from "@/types/database";
import { ShoppingBag, Receipt, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type AddMode = "choice" | "order" | "expense";

interface AddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: AddMode;
}

export function AddSheet({ open, onOpenChange, initialMode: initialModeProp = "choice" }: AddSheetProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AddMode>(initialModeProp);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (open) {
      setMode(initialModeProp);
    }
  }, [open, initialModeProp]);

  useEffect(() => {
    if (open) {
      listCustomersForForm().then(setCustomers);
    }
  }, [open]);

  const handleSuccess = () => {
    onOpenChange(false);
    setMode("choice");
    router.refresh();
  };

  const handleBack = () => setMode("choice");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        {mode === "choice" ? (
          <>
            <SheetHeader>
              <SheetTitle>Ajouter</SheetTitle>
            </SheetHeader>
            <div className="grid gap-3 mt-6 pb-8">
              <button
                type="button"
                onClick={() => setMode("order")}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card text-left hover:bg-accent/50 transition-colors active:scale-[0.98]"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-base">Nouvelle commande</p>
                  <p className="text-sm text-muted-foreground">Client, articles et prix</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode("expense")}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card text-left hover:bg-accent/50 transition-colors active:scale-[0.98]"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Receipt className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-base">Nouvelle dépense</p>
                  <p className="text-sm text-muted-foreground">Montant et catégorie</p>
                </div>
              </button>
            </div>
          </>
        ) : mode === "order" ? (
          <div className="pb-8">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <OrderFormFull customers={customers} onSuccess={handleSuccess} />
          </div>
        ) : (
          <div className="pb-8">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <ExpenseForm onSuccess={handleSuccess} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
