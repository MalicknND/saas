export const metadata = {
  title: "Politique de confidentialité - Mignardise",
  description: "Politique de confidentialité et protection des données personnelles",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <article className="max-w-3xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-slate-900">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Conformément au Règlement général sur la protection des données (RGPD) et
        à la loi Informatique et Libertés.
      </p>

      <div className="mt-8 prose prose-slate max-w-none text-slate-700 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données personnelles est :<br />
            Malick Siguy NDIAYE
            <br />
            8 RUE de l&apos;Aigle, 92250 La Garenne-Colombes, France
            <br />
            Email :{" "}
            <a href="mailto:msndiayedev@gmail.com" className="text-primary underline">
              msndiayedev@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Données collectées
          </h2>
          <p>
            Dans le cadre de l&apos;utilisation de Mignardise, nous collectons
            notamment :
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Données d&apos;identification :</strong> nom, adresse email,
              mot de passe (crypté)
            </li>
            <li>
              <strong>Données d&apos;usage :</strong> commandes, dépenses, clients
              saisis dans l&apos;application
            </li>
            <li>
              <strong>Données techniques :</strong> adresse IP, logs de connexion
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. Finalités et base légale
          </h2>
          <p>
            Les données sont traitées pour : la création et la gestion de votre
            compte, la fourniture du service de suivi, l&apos;amélioration de
            l&apos;application, et le respect de nos obligations légales. La base
            légale est l&apos;exécution du contrat (utilisation du service) et
            votre consentement pour l&apos;inscription.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Durée de conservation
          </h2>
          <p>
            Les données liées à votre compte sont conservées tant que votre
            compte est actif. Après suppression du compte, les données sont
            effacées dans les délais techniques nécessaires, sauf obligation
            légale de conservation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Droit d&apos;accès :</strong> obtenir une copie de vos données
            </li>
            <li>
              <strong>Droit de rectification :</strong> corriger des données
              inexactes
            </li>
            <li>
              <strong>Droit à l&apos;effacement :</strong> demander la suppression de
              vos données
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> recevoir vos données dans un
              format structuré
            </li>
            <li>
              <strong>Droit d&apos;opposition :</strong> vous opposer à certains
              traitements
            </li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, contactez-nous à{" "}
            <a href="mailto:msndiayedev@gmail.com" className="text-primary underline">
              msndiayedev@gmail.com
            </a>
            . Vous
            pouvez également introduire une réclamation auprès de la CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              cnil.fr
            </a>
            ).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            6. Sous-traitants
          </h2>
          <p>
            Nous utilisons les prestataires suivants pour héberger et traiter vos
            données : Vercel (hébergement), Supabase (base de données et
            authentification). Ces prestataires respectent les normes de protection
            des données et peuvent être situés hors de l&apos;Union européenne.
            Des garanties appropriées sont mises en œuvre (clauses types).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">7. Cookies</h2>
          <p>
            L&apos;application utilise des cookies techniques nécessaires au
            fonctionnement (session, authentification). Aucun cookie publicitaire
            ou de suivi tiers n&apos;est utilisé.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            8. Modifications
          </h2>
          <p>
            Cette politique peut être modifiée. Les changements significatifs
            seront portés à votre connaissance. La version en vigueur est celle
            publiée sur cette page.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm text-slate-500">
        Dernière mise à jour : 18 février 2025
      </p>
    </article>
  );
}
