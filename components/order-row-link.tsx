"use client";

import Link from "next/link";

/**
 * Petit island client — lien "Détails" minimal.
 * Le reste de la ligne reste HTML statique.
 */
export function OrderRowLink({ orderId }: { orderId: string }) {
  return (
    <Link
      href={`/order/${orderId}`}
      className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
      aria-label="Voir la commande"
    >
      Détails
    </Link>
  );
}
