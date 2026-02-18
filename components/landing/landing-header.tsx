import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-slate-900">Mignardise</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Se connecter
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
