import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SetupForm } from "@/features/auth/setup-form";
import { workspaceRepository } from "@/repositories/workspace.repository";

export default async function SetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const ids = await workspaceRepository.getUserWorkspaceIds(supabase, user.id);
  if (ids.length > 0) {
    redirect("/today");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-bold">Configurer votre espace</h1>
        <SetupForm />
      </div>
    </div>
  );
}
