import Link from "next/link";
import { listExpenses } from "@/services/expense.service";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { expenseCategoryLabels } from "@/features/expenses/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpenseActions } from "./expense-actions";

export default async function ExpensesPage() {
  let expenses: Awaited<ReturnType<typeof listExpenses>> = [];
  let error: string | null = null;

  try {
    expenses = await listExpenses();
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur";
  }

  if (error) {
    const needsSetup = error.toLowerCase().includes("espace de travail");
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dépenses</h1>
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dépenses</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Nouvelle dépense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Liste des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune dépense</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.date}</TableCell>
                      <TableCell className="font-medium">{e.amount} €</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{expenseCategoryLabels[e.category]}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {e.note ?? "—"}
                      </TableCell>
                      <TableCell>
                        <ExpenseActions expenseId={e.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
