import Link from "next/link";
import { listCustomersWithDebt } from "@/services/debt.service";
import { markCustomerPaid } from "@/actions/customers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";
import { MarkPaidButton } from "./mark-paid-button";

export default async function CustomersPage() {
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
        <h1 className="text-xl font-bold">Clients & dettes</h1>
        <Card className="rounded-2xl">
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {needsSetup && (
              <Button asChild><Link href="/setup">Créer mon espace</Link></Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Clients & dettes</h1>

      {debts.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center">
            <p className="text-6xl mb-4">🎉</p>
            <p className="text-lg font-semibold mb-2">Tout est réglé !</p>
            <p className="text-muted-foreground">Aucune dette en cours</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {debts.map((d) => (
            <Card key={d.id} className="rounded-2xl overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{d.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.total_orders.toFixed(0)} € de commandes · {d.total_paid.toFixed(0)} € payé
                    </p>
                  </div>
                  <p className="font-bold text-lg text-[hsl(var(--loss))]">
                    {d.debt.toFixed(0)} €
                  </p>
                </div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
