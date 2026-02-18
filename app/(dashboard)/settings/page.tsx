import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ProfileForm } from "@/features/settings/profile-form";
import { PasswordForm } from "@/features/settings/password-form";
import { DeleteAccountButton } from "@/features/settings/delete-account-button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    "";

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Paramètres</h1>

      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <ProfileForm initialFullName={fullName} />
        </CardContent>
      </Card>

      {/* Compte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PasswordForm />
          <div className="border-t pt-4">
            <form action={signOut}>
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Supprimer le compte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
