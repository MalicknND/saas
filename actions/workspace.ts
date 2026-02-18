"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createWorkspace(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  // RPC SECURITY DEFINER : crée profil + workspace (contourne erreur 42501)
  const { data: workspaceId, error } = await supabase.rpc("create_workspace_on_setup", {
    workspace_name: name.trim(),
  });

  if (error) {
    if (error.code === "42883") {
      throw new Error(
        "Exécutez la migration 00004_setup_workspace_rpc.sql dans Supabase (SQL Editor)"
      );
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/today");
  return { success: true, workspaceId: workspaceId as string };
}

export async function createWorkspaceFromForm(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) {
    throw new Error("Le nom est requis");
  }
  await createWorkspace(name.trim());
  redirect("/today");
}
