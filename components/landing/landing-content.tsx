import Link from "next/link";
import {
  Calendar,
  ShoppingBag,
  Receipt,
  Users,
  TrendingUp,
  Smartphone,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Résumé du jour",
    description: "Reçu, dépensé et bénéfice en un coup d'œil. Toujours à jour.",
  },
  {
    icon: ShoppingBag,
    title: "Suivi des commandes",
    description: "Commandes, statut de livraison et paiements partiels.",
  },
  {
    icon: Receipt,
    title: "Dépenses par catégorie",
    description: "Ingrédients, emballage, livraison... Gérez vos sorties facilement.",
  },
  {
    icon: Users,
    title: "Clients & dettes",
    description: "Qui doit quoi ? Tout marquer payé en un clic.",
  },
  {
    icon: TrendingUp,
    title: "Tableau de bord simple",
    description: "Pas de compta complexe. Juste le cash au quotidien.",
  },
  {
    icon: Smartphone,
    title: "Pensé pour le mobile",
    description: "Utilisez-le sur votre téléphone, partout.",
  },
];

export function LandingContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            Le suivi quotidien
            <br />
            <span className="text-primary">pour votre cuisine maison</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mignardises, commandes événements, ventes WhatsApp ou Instagram — gardez la main sur
            votre cash sans compta compliquée.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Commencer
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-3 text-slate-600 text-center max-w-2xl mx-auto">
            Un outil simple pour suivre vos entrées, sorties et dettes clients.
          </p>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Prêt à simplifier votre quotidien ?
          </h2>
          <p className="mt-4 text-slate-300">
            Inscrivez-vous en quelques secondes. Sans engagement.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 min-h-[52px] px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Se connecter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
