import Link from "next/link";
import { getTodayDashboard } from "@/services/dashboard.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddOrderButton } from "@/features/add/add-order-button";

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

  let summary = { income: 0, expenses: 0, profit: 0 };
  let orders: Awaited<ReturnType<typeof getTodayDashboard>>["orders"] = [];
  let totalDebt = 0;
  let debtorsCount = 0;
  let error: string | null = null;

  try {
    const data = await getTodayDashboard(today);
    summary = data.summary;
    orders = data.orders;
    totalDebt = data.debts.total;
    debtorsCount = data.debts.count;
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

  const dateFormatted = formatDateFr(today);

  return (
    <div className="min-h-full">
      {/* Bloc principal : header orange avec les 3 cartes intégrées */}
      <header className="rounded-b-3xl bg-primary text-primary-foreground px-6 pt-6 pb-8">
        <p className="text-sm uppercase tracking-wider opacity-90">Aujourd&apos;hui</p>
        <h1 className="text-2xl font-bold mt-1 capitalize">{dateFormatted}</h1>

        {/* 4 cartes Reçu | Dépensé | Solde du jour | À recevoir */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="rounded-xl bg-white/20 p-4 text-center">
            <p className="text-xs opacity-90">Reçu</p>
            <p className="text-lg font-bold">{summary.income.toFixed(0)} €</p>
          </div>
          <Link href="/expenses" className="rounded-xl bg-white/20 p-4 text-center block active:scale-[0.98] transition-transform">
            <p className="text-xs opacity-90">Dépensé</p>
            <p className="text-lg font-bold">{summary.expenses.toFixed(0)} €</p>
          </Link>
          <div
            className={`rounded-xl p-4 text-center ${
              summary.profit >= 0 ? "bg-white/20" : "bg-[hsl(var(--loss))]"
            }`}
          >
            <p className="text-xs opacity-90">Solde du jour</p>
            <p className="text-lg font-bold">
              {summary.profit >= 0 ? "+" : ""}{summary.profit.toFixed(0)} €
            </p>
          </div>
          <Link href="/debts" className="rounded-xl bg-white/20 p-4 text-center block active:scale-[0.98] transition-transform">
            <p className="text-xs opacity-90">À recevoir</p>
            <p className="text-lg font-bold">{totalDebt.toFixed(0)} €</p>
          </Link>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Infos passives : compréhension en 1 seconde */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <p className="text-base font-medium text-foreground">
            {orders.length === 0
              ? "Aucune commande aujourd'hui"
              : `${orders.length} commande${orders.length > 1 ? "s" : ""} à préparer aujourd'hui`}
          </p>
          {debtorsCount > 0 && (
            <Link
              href="/debts"
              className="text-base font-medium text-primary hover:underline shrink-0 active:opacity-80 transition-opacity"
            >
              Il reste {debtorsCount} client{debtorsCount > 1 ? "s" : ""} à payer
            </Link>
          )}
        </div>

        {/* Liste commandes du jour */}
        <h2 className="text-lg font-semibold">Commandes du jour</h2>

        {orders.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-12 text-center">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-muted-foreground mb-4">Aucune commande aujourd&apos;hui</p>
              <AddOrderButton />
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
                    <p className="font-bold text-lg">{o.total_price} €</p>
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
