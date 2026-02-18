export const metadata = {
  title: "Conditions générales d'utilisation - Mignardise",
  description: "Conditions générales d'utilisation du service Mignardise",
};

export default function CGUPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-slate-900">
        Conditions générales d&apos;utilisation
      </h1>
      <p className="mt-2 text-sm text-slate-500">CGU du service Mignardise</p>

      <div className="mt-8 prose prose-slate max-w-none text-slate-700 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Objet et acceptation
          </h2>
          <p>
            Les présentes Conditions générales d&apos;utilisation (CGU) régissent
            l&apos;accès et l&apos;utilisation du service Mignardise. En créant un
            compte ou en utilisant le
            service, vous acceptez sans réserve les présentes CGU.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Description du service
          </h2>
          <p>
            Mignardise est un outil de suivi destiné aux vendeurs de cuisine
            maison : mignardises, commandes événements, ventes via WhatsApp ou
            Instagram. Le service permet de suivre les entrées (reçus), sorties
            (dépenses), bénéfices et dettes clients au quotidien, sans prétention
            à se substituer à un logiciel de comptabilité.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. Compte utilisateur
          </h2>
          <p>
            La création d&apos;un compte est requise. Vous vous engagez à fournir
            des informations exactes et à maintenir la confidentialité de vos
            identifiants. Vous êtes responsable des activités réalisées sous
            votre compte.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Utilisation du service
          </h2>
          <p>
            Vous vous engagez à utiliser Mignardise de manière conforme aux lois
            en vigueur. Il est interdit d&apos;utiliser le service pour des
            activités illicites, de tenter d&apos;accéder à des données
            d&apos;autres utilisateurs, ou de porter atteinte à la disponibilité
            ou la sécurité du service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Données et responsabilité
          </h2>
          <p>
            Les données que vous saisissez (commandes, dépenses, clients)
            restent sous votre responsabilité. Mignardise met en œuvre des
            mesures techniques pour protéger vos données, mais ne saurait
            garantir une disponibilité ou une conservation à 100 %. Le service est
            fourni « en l&apos;état ». Nous recommandons des sauvegardes
            régulières de vos informations importantes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">6. Prix</h2>
          <p>
            Le service est actuellement proposé à titre gratuit. Des modalités
            tarifaires pourront être introduites ultérieurement, avec information
            préalable des utilisateurs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">7. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis les
            paramètres. L&apos;éditeur se réserve le droit de suspendre ou
            résilier l&apos;accès en cas de non-respect des CGU, après
            avertissement si possible.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            8. Propriété intellectuelle
          </h2>
          <p>
            L&apos;application Mignardise, sa structure et son code, sont
            protégés par le droit d&apos;auteur. Vous ne disposez d&apos;aucun
            droit de propriété sur la plateforme, uniquement un droit
            d&apos;usage dans le cadre du service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            9. Droit applicable et litiges
          </h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de
            litige, les tribunaux français seront seuls compétents, après
            tentative de résolution amiable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">10. Contact</h2>
          <p>
            Pour toute question :{" "}
            <a href="mailto:msndiayedev@gmail.com" className="text-primary underline">
              msndiayedev@gmail.com
            </a>
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm text-slate-500">
        Dernière mise à jour : 18 février 2025
      </p>
    </article>
  );
}
