"use client";

import { signOut } from "@/actions/auth";
import { LogOut } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-end border-b border-border bg-background/95 backdrop-blur px-4 py-2 min-h-[48px]">
      <form action={signOut}>
        <button
          type="submit"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </form>
    </header>
  );
}
