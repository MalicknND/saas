export const metadata = {
  title: "Mentions légales - Mignardise",
  description: "Mentions légales du site Mignardise",
};

export default function MentionsLegalesPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-slate-900">Mentions légales</h1>
      <p className="mt-2 text-sm text-slate-500">
        Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
        l&apos;économie numérique.
      </p>

      <div className="mt-8 prose prose-slate max-w-none text-slate-700 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Éditeur du site</h2>
          <p>
            Le site Mignardise est édité par :<br />
            <strong>[Dénomination sociale ou nom du responsable]</strong>
            <br />
            [Forme juridique : SARL, SAS, auto-entrepreneur, etc.]
            <br />
            [Siège social : adresse complète]
            <br />
            [Capital social si applicable]
            <br />
            [RCS ou répertoire des métiers si applicable]
            <br />
            [N° de TVA intracommunautaire si applicable]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Directeur de la publication
          </h2>
          <p>[Nom du directeur de la publication]</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Hébergeur</h2>
          <p>
            Le site est hébergé par :<br />
            <strong>Vercel Inc.</strong>
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            <br />
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              vercel.com
            </a>
          </p>
          <p className="mt-4">
            Données stockées par :<br />
            <strong>Supabase (Supabase Inc.)</strong>
            <br />
            970 Toa Payoh North, #07-04, Singapore 318992
            <br />
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              supabase.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. Contact</h2>
          <p>
            Pour toute question concernant le site Mignardise :<br />
            Email : [adresse email de contact]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos, etc.) est
            protégé par le droit d&apos;auteur. Toute reproduction, représentation ou
            exploitation, totale ou partielle, sans autorisation préalable est
            interdite.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm text-slate-500">Dernière mise à jour : [date]</p>
    </article>
  );
}
