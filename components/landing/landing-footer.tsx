import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="py-8 px-6 lg:px-8 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
          Mignardise
        </Link>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Pied de page"
        >
          <Link
            href="/mentions-legales"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Mentions légales
          </Link>
          <Link
            href="/politique-confidentialite"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Politique de confidentialité
          </Link>
          <Link href="/cgu" className="text-sm text-slate-600 hover:text-slate-900">
            CGU
          </Link>
        </nav>
      </div>
    </footer>
  );
}
