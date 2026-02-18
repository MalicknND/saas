"use client";

import Link from "next/link";

/**
 * Petit island client — overlay cliquable uniquement.
 * Le contenu de la carte reste HTML statique (pas d'hydratation).
 */
export function OrderCardLink({ orderId }: { orderId: string }) {
  return (
    <Link
      href={`/order/${orderId}`}
      className="absolute inset-0 z-10"
      aria-label="Voir la commande"
    />
  );
}
