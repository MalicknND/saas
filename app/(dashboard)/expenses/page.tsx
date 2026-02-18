import Link from "next/link";
import { listExpenses } from "@/services/expense.service";
import { expenseCategoryLabels } from "@/features/expenses/utils";
import { AddExpenseButton } from "@/features/expenses/add-expense-button";
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
      <div className="p-4 space-y-6">
        <h1 className="text-xl font-bold">Dépenses</h1>
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
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Dépenses</h1>
        <AddExpenseButton />
      </div>

      <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Liste des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune dépense</p>
            ) : (
              <>
                {/* Mobile : cartes empilées */}
                <div className="space-y-3 md:hidden">
                  {expenses.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-xl border p-4 flex justify-between items-start gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-lg">{e.amount} €</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {expenseCategoryLabels[e.category]}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{e.date}</p>
                        {e.note && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">{e.note}</p>
                        )}
                      </div>
                      <ExpenseActions expenseId={e.id} />
                    </div>
                  ))}
                </div>
                {/* Desktop : tableau */}
                <div className="hidden md:block overflow-x-auto">
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
                </div>
              </>
            )}
          </CardContent>
      </Card>
    </div>
  );
}
