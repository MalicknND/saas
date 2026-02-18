import Link from "next/link";
import { listOrders } from "@/services/order.service";
import { AddOrderButtonNav } from "@/features/orders/add-order-button";
import { OrderCardLink } from "@/components/order-card-link";
import { OrderRowLink } from "@/components/order-row-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let error: string | null = null;

  try {
    orders = await listOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error) {
    const needsSetup = error.toLowerCase().includes("espace de travail");
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-xl font-bold">Commandes</h1>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {needsSetup && (
              <Button asChild>
                <Link href="/setup">Créer mon espace de travail</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Commandes</h1>
        <AddOrderButtonNav />
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <CardContent className="pt-6">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune commande. Utilisez le bouton + pour en créer une.
            </p>
          ) : (
            <>
              {/* Mobile : cartes empilées (HTML statique + petit OrderCardLink client) */}
              <div className="space-y-3 md:hidden">
                {orders.map((o) => (
                  <div key={o.id} className="relative rounded-xl border p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{o.customer?.name ?? "—"}</p>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">{o.items}</p>
                        <p className="text-xs text-muted-foreground mt-1">{o.delivery_date}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{statusLabels[o.status]}</Badge>
                          <Badge
                            variant={
                              o.payment_status === "paid"
                                ? "default"
                                : o.payment_status === "deposit"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {paymentLabels[o.payment_status]}
                          </Badge>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold text-lg">{o.total_price} €</p>
                        <span className="text-xs text-primary font-medium">Détails</span>
                      </div>
                    </div>
                    <OrderCardLink orderId={o.id} />
                  </div>
                ))}
              </div>

              {/* Desktop : tableau */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.delivery_date}</TableCell>
                        <TableCell className="font-medium">
                          {o.customer?.name ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {o.items}
                        </TableCell>
                        <TableCell>{o.total_price} €</TableCell>
                        <TableCell>
                          <Badge variant="outline">{statusLabels[o.status]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              o.payment_status === "paid"
                                ? "default"
                                : o.payment_status === "deposit"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {paymentLabels[o.payment_status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <OrderRowLink orderId={o.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
