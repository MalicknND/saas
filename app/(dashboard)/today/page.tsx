import Link from "next/link";
import { getDailySummary } from "@/services/summary.service";
import { listOrders } from "@/services/order.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function formatDateFr(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function TodayPage() {
  const today = new Date().toISOString().slice(0, 10);

  let summary: Awaited<ReturnType<typeof getDailySummary>> = { income: 0, expenses: 0, profit: 0 };
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let error: string | null = null;

  try {
    [summary, orders] = await Promise.all([
      getDailySummary(today),
      listOrders({ deliveryDate: today }),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error) {
    const needsSetup = error.toLowerCase().includes("espace de travail");
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-xl font-bold">Aujourd&apos;hui</h1>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {needsSetup && (
              <Button asChild>
                <Link href="/setup">Créer mon espace</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentLabels: Record<string, string> = {
    unpaid: "Impayé",
    deposit: "Acompte",
    paid: "Payé",
  };
  const statusLabels: Record<string, string> = {
    pending: "En attente",
    preparing: "En prépa",
    delivered: "Livré",
  };

  return (
    <div className="min-h-full">
      {/* Header arrondi */}
      <header className="rounded-b-3xl bg-primary text-primary-foreground px-6 py-8">
        <h1 className="text-2xl font-bold capitalize">
          {formatDateFr(today)}
        </h1>
      </header>

      <div className="p-4 -mt-4 space-y-4">
        {/* 3 cartes Reçu | Dépensé | Bénéfice */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Reçu</p>
              <p className="text-lg font-bold">{summary.income.toFixed(0)} DH</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Dépensé</p>
              <p className="text-lg font-bold">{summary.expenses.toFixed(0)} DH</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Bénéfice</p>
              <p
                className={`text-lg font-bold ${
                  summary.profit >= 0 ? "text-[hsl(var(--profit))]" : "text-[hsl(var(--loss))]"
                }`}
              >
                {summary.profit >= 0 ? "+" : ""}{summary.profit.toFixed(0)} DH
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste commandes du jour */}
        <h2 className="text-lg font-semibold pt-2">Commandes du jour</h2>

        {orders.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-12 text-center">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-muted-foreground mb-4">Aucune commande aujourd&apos;hui</p>
              <Button asChild size="lg" className="min-h-[48px]">
                <Link href="/add-order">
                  <Plus className="mr-2 h-5 w-5" />
                  Ajouter une commande
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link key={o.id} href={`/order/${o.id}`} className="block">
                <Card className="rounded-2xl p-4 active:scale-[0.98] transition-transform">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{o.customer?.name ?? "—"}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {o.items}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            o.payment_status === "paid"
                              ? "bg-[hsl(var(--profit))]/20 text-[hsl(var(--profit))]"
                              : o.payment_status === "deposit"
                                ? "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]"
                                : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {paymentLabels[o.payment_status]}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {statusLabels[o.status]}
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{o.total_price} DH</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
