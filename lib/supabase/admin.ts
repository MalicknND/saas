/**
 * Supabase admin client - uses service_role for privileged operations.
 * ONLY use in server-side code (Server Actions). Never expose to the browser.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Ajoutez-le dans .env.local pour activer la suppression de compte."
    );
  }

  return createClient(url, key);
}
