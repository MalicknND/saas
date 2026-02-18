import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { workspaceRepository } from "@/repositories/workspace.repository";
import { LandingContent } from "@/components/landing/landing-content";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingContent />;
  }

  const ids = await workspaceRepository.getUserWorkspaceIds(supabase, user.id);
  if (ids.length === 0) {
    redirect("/setup");
  }

  redirect("/today");
}
