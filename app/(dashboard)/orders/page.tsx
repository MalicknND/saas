import Link from "next/link";
import { listOrders } from "@/services/order.service";
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Commandes</h1>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <Button asChild>
          <Link href="/orders/new">Nouvelle commande</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune commande.{" "}
              <Link href="/orders/new" className="text-primary underline">
                Créer une commande
              </Link>
            </p>
          ) : (
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/order/${o.id}`}>Détails</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
