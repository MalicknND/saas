"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getActionErrorMessage } from "@/lib/action-error";

export async function createWorkspace(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: { _form: ["Non authentifié"] } };

  try {
    const { data: workspaceId, error } = await supabase.rpc("create_workspace_on_setup", {
      workspace_name: name.trim(),
    });

    if (error) {
      if (error.code === "42883") {
        return { error: { _form: ["Exécutez la migration 00004_setup_workspace_rpc.sql dans Supabase (SQL Editor)"] } };
      }
      return { error: { _form: [getActionErrorMessage(error)] } };
    }

    revalidatePath("/");
    revalidatePath("/today");
    return { success: true, workspaceId: workspaceId as string };
  } catch (e) {
    return { error: { _form: [getActionErrorMessage(e)] } };
  }
}

export async function createWorkspaceFromForm(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) {
    return { error: { _form: ["Le nom est requis"] } };
  }
  const result = await createWorkspace(name.trim());
  if (result.error) return result;
  redirect("/today");
}
