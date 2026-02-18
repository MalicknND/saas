import { redirect } from "next/navigation";

/** Redirige vers le formulaire canonique de nouvelle commande */
export default function OrderRedirectPage() {
  redirect("/add-order");
}
