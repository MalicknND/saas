"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mignardise_loading_shown";

export default function DashboardLoading() {
  // true par défaut = skeleton au premier paint (première visite ou avant lecture du storage)
  const [showFullSkeleton, setShowFullSkeleton] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) {
      queueMicrotask(() => setShowFullSkeleton(false));
    } else {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  // Navigations suivantes : pas de skeleton (contenu précédent visible brièvement)
  if (!showFullSkeleton) {
    return null;
  }

  // Première fois dans la session : skeleton complet
  return (
    <div className="min-h-full animate-pulse">
        <header className="rounded-b-3xl bg-primary px-6 pt-6 pb-8">
          <div className="h-4 w-24 rounded bg-white/30" />
          <div className="mt-2 h-8 w-48 rounded bg-white/40" />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl bg-white/20 p-4 h-20" />
            ))}
          </div>
        </header>
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="h-5 w-48 rounded bg-muted" />
            <div className="h-5 w-36 rounded bg-muted" />
          </div>
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border p-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-muted" />
                    <div className="h-4 w-24 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-12 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
