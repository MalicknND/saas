"use client";

import { useEffect } from "react";

/**
 * Ping invisible au chargement — garde le serveur chaud (évite cold start).
 * Appelé une seule fois au mount du layout dashboard.
 */
export function WarmupPing() {
  useEffect(() => {
    fetch("/api/warmup", { keepalive: true }).catch(() => {});
  }, []);
  return null;
}
