/**
 * Devises disponibles pour le sélecteur au setup.
 * Format: [valeur, label] — valeur = symbole ou code stocké en DB
 */
export const CURRENCIES: { value: string; label: string }[] = [
  { value: "€", label: "€ (Euro)" },
  { value: "DH", label: "DH (Dirham marocain)" },
  { value: "$", label: "$ (Dollar US)" },
  { value: "XOF", label: "XOF (Franc CFA)" },
  { value: "XAF", label: "XAF (Franc CFA BEAC)" },
  { value: "£", label: "£ (Livre sterling)" },
  { value: "DZD", label: "DZD (Dinar algérien)" },
  { value: "TND", label: "TND (Dinar tunisien)" },
];
