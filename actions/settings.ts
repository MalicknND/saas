"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getActionErrorMessage } from "@/lib/action-error";

export type SettingsActionResult = { error?: string; success?: string };

export async function updateProfile(formData: FormData): Promise<SettingsActionResult> {
  try {
    const fullName = (formData.get("full_name") as string)?.trim();
    if (!fullName) {
      return { error: "Le nom est requis." };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "Session expirée. Reconnectez-vous." };
    }

    // Mise à jour user_metadata (auth)
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (updateAuthError) {
      return { error: getActionErrorMessage(updateAuthError) };
    }

    // Mise à jour table profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (profileError) {
      return { error: getActionErrorMessage(profileError) };
    }

    return { success: "Profil mis à jour." };
  } catch (e) {
    return { error: getActionErrorMessage(e) };
  }
}

export async function updatePassword(formData: FormData): Promise<SettingsActionResult> {
  try {
    const newPassword = formData.get("new_password") as string;
    if (!newPassword || newPassword.length < 6) {
      return { error: "Le mot de passe doit faire au moins 6 caractères." };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "Session expirée. Reconnectez-vous." };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { error: getActionErrorMessage(error) };
    }

    return { success: "Mot de passe mis à jour." };
  } catch (e) {
    return { error: getActionErrorMessage(e) };
  }
}

export async function deleteAccount(): Promise<SettingsActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "Session expirée. Reconnectez-vous." };
    }

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      return { error: getActionErrorMessage(error) };
    }

    await supabase.auth.signOut();
    redirect("/");
  } catch (e) {
    if ((e as { digest?: string })?.digest === "NEXT_REDIRECT") throw e;
    return { error: getActionErrorMessage(e) };
  }
}
