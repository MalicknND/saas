import { ExpenseFormQuick } from "@/features/expenses/expense-form-quick";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddExpensePage() {
  return (
    <div className="space-y-6 max-w-sm">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/today"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle dépense</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">Montant + catégorie</p>
        </CardHeader>
        <CardContent>
          <ExpenseFormQuick />
        </CardContent>
      </Card>
    </div>
  );
}
