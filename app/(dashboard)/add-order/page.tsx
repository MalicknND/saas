import Link from "next/link";
import { listCustomers } from "@/services/customer.service";
import { OrderFormFull } from "@/features/orders/order-form-full";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="p-4 space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/today"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
        </Button>
        <p className="text-muted-foreground">{error}</p>
        {needsSetup && <Button asChild><Link href="/setup">Créer mon espace</Link></Button>}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/today"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-xl font-bold">Nouvelle commande</h1>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6 pt-6">
          <OrderFormFull customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
