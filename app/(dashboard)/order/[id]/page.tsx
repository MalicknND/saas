import Link from "next/link";
import { getOrder } from "@/services/order.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { OrderDetailActions } from "./order-detail-actions";
import { DeleteOrderButton } from "./delete-order-button";
import { OrderPaymentForm } from "@/features/orders/order-payment-form";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  preparing: "En prépa",
  delivered: "Livré",
};

const paymentLabels: Record<string, string> = {
  unpaid: "Impayé",
  deposit: "Acompte",
  paid: "Payé",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getOrder>> | null = null;
  let error: string | null = null;

  try {
    data = await getOrder(id);
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error || !data) {
    return (
      <div className="p-4 space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/today"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
        </Button>
        <p className="text-muted-foreground">{error ?? "Commande introuvable"}</p>
      </div>
    );
  }

  const { order, customer, payments, totalPaid, remaining } = data;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/today"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-xl font-bold">Commande</h1>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-semibold text-lg">{customer?.name}</p>
            {customer?.phone && (
              <a href={`tel:${customer.phone}`} className="text-primary flex items-center gap-1 mt-1">
                {customer.phone}
              </a>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Articles</p>
            <p>{order.items}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Prix total</p>
            <p className="font-bold text-xl">{order.total_price} €</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Payé / Reste</p>
            <p className="font-semibold">
              {totalPaid.toFixed(0)} € payé · <span className={remaining > 0 ? "text-[hsl(var(--loss))]" : "text-[hsl(var(--profit))]"}>{remaining.toFixed(0)} € restant</span>
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Statut paiement</p>
            <OrderDetailActions
              orderId={order.id}
              currentPaymentStatus={order.payment_status}
              currentStatus={order.status}
            />
          </div>
        </CardContent>
      </Card>

      <DeleteOrderButton orderId={order.id} />

      <div>
        <h2 className="font-semibold mb-2">Ajouter un paiement</h2>
        <OrderPaymentForm orderId={order.id} />
      </div>

      {payments.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Paiements reçus</h2>
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{p.paid_at}</span>
                <span className="font-medium">{p.amount} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
