import { listCustomers } from "@/services/customer.service";
import { OrderForm } from "@/features/orders/order-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const params = await searchParams;
  let customers: Awaited<ReturnType<typeof listCustomers>> = [];
  let error: string | null = null;

  try {
    customers = await listCustomers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Nouvelle commande</CardTitle>
        </CardHeader>
        <CardContent>
            <OrderForm customers={customers} defaultCustomerId={params.customer} />
        </CardContent>
      </Card>
    </div>
  );
}
