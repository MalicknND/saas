import Link from "next/link";
import { listCustomersWithDebt } from "@/services/debt.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { MarkPaidButton } from "@/app/(dashboard)/customers/mark-paid-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DebtsPage() {
  let debts: Awaited<ReturnType<typeof listCustomersWithDebt>> = [];
  let error: string | null = null;

  try {
    debts = await listCustomersWithDebt();
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error) {
    const needsSetup = error.toLowerCase().includes("espace de travail");
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-xl font-bold">À recevoir</h1>
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

  const totalDebt = debts.reduce((s, d) => s + d.debt, 0);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">À recevoir</h1>

      <Card className="rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Paiements en attente</CardTitle>
          <p className="text-2xl font-bold">{totalDebt.toFixed(2)} € à recouvrer</p>
        </CardHeader>
        <CardContent>
          {debts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune dette en cours.</p>
          ) : (
            <>
              {/* Mobile: cards */}
              <div className="space-y-3 md:hidden">
                {debts.map((d) => (
                  <div key={d.id} className="rounded-lg border p-3 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{d.name}</span>
                      <span className="font-bold text-primary">{d.debt.toFixed(2)} €</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Payé: {d.total_paid.toFixed(2)} € / Total: {d.total_orders.toFixed(2)} €
                    </p>
                    <div className="flex gap-2">
                      {d.phone && (
                        <Button variant="outline" size="sm" asChild className="flex-1 rounded-xl">
                          <a href={`tel:${d.phone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Appeler
                          </a>
                        </Button>
                      )}
                      <MarkPaidButton customerId={d.id} customerName={d.name} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead className="text-right">Total commandes</TableHead>
                      <TableHead className="text-right">Total payé</TableHead>
                      <TableHead className="text-right">Reste dû</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>
                          {d.phone ? (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`tel:${d.phone}`}>
                                <Phone className="mr-1 h-4 w-4" />
                                {d.phone}
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{d.total_orders.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">{d.total_paid.toFixed(2)} €</TableCell>
                        <TableCell className="text-right font-bold">{d.debt.toFixed(2)} €</TableCell>
                        <TableCell>
                          <MarkPaidButton customerId={d.id} customerName={d.name} />
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
