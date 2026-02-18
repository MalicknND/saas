"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Plus, Users, FileText } from "lucide-react";

const navItems = [
  { href: "/today", label: "Aujourd'hui", icon: Home },
  { href: "/add", label: "Ajouter", icon: Plus, center: true },
  { href: "/orders", label: "Commandes", icon: FileText },
  { href: "/customers", label: "Clients", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)] pt-2"
      role="navigation"
      aria-label="Navigation principale"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const isCenter = item.center;

        if (isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-14 w-14 -mt-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform active:scale-95",
                isActive && "ring-2 ring-primary ring-offset-2"
              )}
              aria-label={item.label}
            >
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
