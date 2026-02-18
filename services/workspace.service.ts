/**
 * Workspace service - resolves current workspace for the authenticated user.
 * All other services depend on this for workspace_id.
 */
import { createClient } from "@/lib/supabase/server";
import { workspaceRepository } from "@/repositories/workspace.repository";

export async function getCurrentWorkspaceId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const ids = await workspaceRepository.getUserWorkspaceIds(supabase, user.id);
  return ids[0] ?? null;
}

export async function getCurrentWorkspace() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const workspaces = await workspaceRepository.getByOwner(supabase, user.id);
  return workspaces[0] ?? null;
}

export async function requireWorkspace(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; workspaceId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const ids = await workspaceRepository.getUserWorkspaceIds(supabase, user.id);
  const workspaceId = ids[0];
  if (!workspaceId) throw new Error("Aucun espace de travail. Créez-en un.");

  return { supabase, workspaceId };
}
