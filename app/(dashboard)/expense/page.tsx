import { redirect } from "next/navigation";

/** Redirige vers le formulaire canonique de nouvelle dépense */
export default function ExpenseRedirectPage() {
  redirect("/add-expense");
}
