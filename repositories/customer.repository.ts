import type { RepositoryClient } from "./base";
import type { Customer } from "@/types/database";

export const customerRepository = {
  async listByWorkspace(client: RepositoryClient, workspaceId: string) {
    const { data, error } = await client
      .from("customers")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("name");

    if (error) throw error;
    return data as Customer[];
  },

  /** Trouve un client par nom exact (insensible à la casse). Créer si absent. */
  async findByName(client: RepositoryClient, workspaceId: string, name: string): Promise<Customer | null> {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const { data, error } = await client
      .from("customers")
      .select("*")
      .eq("workspace_id", workspaceId)
      .ilike("name", trimmed)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as Customer | null;
  },

  async getById(client: RepositoryClient, id: string, workspaceId: string) {
    const { data, error } = await client
      .from("customers")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async create(client: RepositoryClient, input: Omit<Customer, "id" | "created_at" | "updated_at">) {
    const { data, error } = await client
      .from("customers")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async update(
    client: RepositoryClient,
    id: string,
    workspaceId: string,
    input: Partial<Pick<Customer, "name" | "phone" | "notes">>
  ) {
    const { data, error } = await client
      .from("customers")
      .update(input)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async delete(client: RepositoryClient, id: string, workspaceId: string) {
    const { error } = await client
      .from("customers")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
  },
};
