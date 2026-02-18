/**
 * Warmup endpoint — garde le serveur "chaud" pour éviter le cold start.
 * Appelé au chargement du dashboard (fetch invisible via WarmupPing).
 * Serverless reste actif ≈ 5-15 min après dernier appel.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("ok", { status: 200 });
}
