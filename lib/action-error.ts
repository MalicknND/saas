/**
 * Extrait un message utilisateur à partir d'une erreur.
 * Utilisé par les Server Actions pour retourner des messages adaptés.
 */
export function getActionErrorMessage(error: unknown): string {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : "";

  if (msg) {
    if (msg.includes("JWT") || msg.includes("session")) return "Session expirée. Reconnectez-vous.";
    if (msg.includes("permission") || msg.includes("42501")) return "Vous n'avez pas accès à cette ressource.";
    if (msg.includes("foreign key") || msg.includes("23503")) return "Cette ressource est liée à d'autres données.";
    if (msg.includes("duplicate") || msg.includes("23505")) return "Cette entrée existe déjà.";
    if (msg.includes("Non authentifié") || msg.includes("Aucun espace de travail") || msg.includes("Client requis"))
      return msg;
    return msg;
  }
  return "Une erreur inattendue s'est produite.";
}
