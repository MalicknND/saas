import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Receipt } from "lucide-react";

export default function AddChoicePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Ajouter</h1>

      <div className="space-y-4 pt-4">
        <Link href="/add-order">
          <Card className="rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Nouvelle commande</h2>
                <p className="text-sm text-muted-foreground">
                  Client, articles et prix
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add-expense">
          <Card className="rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Receipt className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Nouvelle dépense</h2>
                <p className="text-sm text-muted-foreground">
                  Montant et catégorie
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
