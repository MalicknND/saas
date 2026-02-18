import Link from "next/link";
import { ExpenseFormChips } from "@/features/expenses/expense-form-chips";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddExpensePage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/add"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-xl font-bold">Nouvelle dépense</h1>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6 pt-6">
          <ExpenseFormChips />
        </CardContent>
      </Card>
    </div>
  );
}
