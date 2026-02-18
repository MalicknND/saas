/**
 * Base repository - Supabase client type.
 * All repositories receive a client that already has RLS context (authenticated user).
 */
import type { SupabaseClient } from "@supabase/supabase-js";

export type RepositoryClient = SupabaseClient;
