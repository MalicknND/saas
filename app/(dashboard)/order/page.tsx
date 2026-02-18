import { listCustomers } from "@/services/customer.service";
import { OrderFormQuick } from "@/features/orders/order-form-quick";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function AddOrderPage() {
  let customers: Awaited<ReturnType<typeof listCustomers>> = [];
  let error: string | null = null;

  try {
    customers = await listCustomers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error) {
    const needsSetup = error.toLowerCase().includes("espace de travail");
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/today"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
        </Button>
        <p className="text-muted-foreground">{error}</p>
        {needsSetup && (
          <Button asChild><Link href="/setup">Créer mon espace</Link></Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/today"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle commande</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">Client : tapez le nom ou choisissez</p>
        </CardHeader>
        <CardContent>
          <OrderFormQuick customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
