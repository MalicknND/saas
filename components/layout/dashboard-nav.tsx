"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Plus, FileText, Wallet, Settings } from "lucide-react";
import { useAddSheet } from "@/features/add/add-sheet-context";

const navItems = [
  { href: "/orders", label: "Commandes", icon: FileText },
  { href: "/debts", label: "À recevoir", icon: Wallet },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { openAdd } = useAddSheet();

  const prefetchOnTouch = (href: string) => {
    router.prefetch(href);
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)] pt-2"
        role="navigation"
        aria-label="Navigation principale"
      >
        <Link
          href="/today"
          onTouchStart={() => prefetchOnTouch("/today")}
          className={cn(
            "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 px-4 py-2 text-xs font-medium transition-all active:scale-95",
            pathname === "/today" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-6 w-6 shrink-0" strokeWidth={pathname === "/today" ? 2.5 : 2} />
          <span>Aujourd&apos;hui</span>
        </Link>

        <button
          type="button"
          onClick={() => openAdd()}
          className={cn(
            "flex h-14 w-14 -mt-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform active:scale-95"
          )}
          aria-label="Ajouter"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onTouchStart={() => prefetchOnTouch(item.href)}
              className={cn(
                "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 px-4 py-2 text-xs font-medium transition-all active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-6 w-6 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
