/**
 * Page d'accueil : landing (non connecté) ou redirection (connecté)
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { workspaceRepository } from "@/repositories/workspace.repository";
import { LandingPage } from "@/components/landing/landing-page";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  const ids = await workspaceRepository.getUserWorkspaceIds(supabase, user.id);
  if (ids.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Food Tracker</h1>
        <p className="mt-2 text-muted-foreground text-center">Créez un espace pour commencer</p>
        <a
          href="/setup"
          className="mt-6 min-h-[48px] px-6 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center"
        >
          Créer mon espace
        </a>
      </div>
    );
  }

  redirect("/today");
}
