import Link from "next/link";
import { getOrder } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PaymentForm } from "./payment-form";
import { OrderStatusForm } from "./order-status-form";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  preparing: "En préparation",
  delivered: "Livré",
};

const paymentLabels: Record<string, string> = {
  unpaid: "Non payé",
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
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <p className="text-muted-foreground">{error ?? "Commande introuvable"}</p>
      </div>
    );
  }

  const { order, customer, payments, totalPaid, remaining } = data;

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Commande</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{statusLabels[order.status]}</Badge>
                <Badge
                  variant={
                    order.payment_status === "paid"
                      ? "default"
                      : order.payment_status === "deposit"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {paymentLabels[order.payment_status]}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{customer?.name}</p>
              {customer?.phone && (
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Articles</p>
              <p>{order.items}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de livraison</p>
              <p>{order.delivery_date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{order.total_price} €</p>
            </div>
            <OrderStatusForm orderId={order.id} initialStatus={order.status} initialPaymentStatus={order.payment_status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Payé: {totalPaid.toFixed(2)} € / Restant: {remaining.toFixed(2)} €
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <PaymentForm orderId={order.id} />
            {payments.length > 0 && (
              <ul className="space-y-2">
                {payments.map((p) => (
                  <li key={p.id} className="flex justify-between text-sm">
                    <span>{p.paid_at} — {p.note ?? "—"}</span>
                    <span className="font-medium">{p.amount} €</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
