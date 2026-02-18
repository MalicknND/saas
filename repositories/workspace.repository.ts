import type { RepositoryClient } from "./base";
import type { Workspace, WorkspaceMember } from "@/types/database";

export const workspaceRepository = {
  async getById(client: RepositoryClient, id: string) {
    const { data, error } = await client
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Workspace;
  },

  async getByOwner(client: RepositoryClient, ownerId: string) {
    const { data, error } = await client
      .from("workspaces")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Workspace[];
  },

  async getMemberships(client: RepositoryClient, userId: string) {
    const { data, error } = await client
      .from("workspace_members")
      .select("*, workspaces(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data as (WorkspaceMember & { workspaces: Workspace })[];
  },

  async create(client: RepositoryClient, input: { name: string; owner_id: string }) {
    const { data, error } = await client
      .from("workspaces")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Workspace;
  },

  async getUserWorkspaceIds(client: RepositoryClient, userId: string): Promise<string[]> {
    const [owned, member] = await Promise.all([
      client.from("workspaces").select("id").eq("owner_id", userId),
      client.from("workspace_members").select("workspace_id").eq("user_id", userId),
    ]);

    const ids = new Set<string>();
    (owned.data ?? []).forEach((r: { id: string }) => ids.add(r.id));
    (member.data ?? []).forEach((r: { workspace_id: string }) => ids.add(r.workspace_id));
    return Array.from(ids);
  },
};
