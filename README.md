# Food Tracker

SaaS opérationnel pour vendeurs de cuisine maison : suivi des commandes, dépenses, profit quotidien et dettes clients.

## Stack

- **Next.js** (App Router) + TypeScript strict
- **TailwindCSS** + **shadcn/ui**
- **Supabase** (PostgreSQL + Auth + RLS)
- **Zod** + **React Hook Form**
- Server Actions pour les mutations

## Structure

```
/app          → Routes (pas de logique métier)
/components   → Composants UI
/features     → Modules métier (orders, expenses, customers)
/services     → Logique métier
/repositories → Accès base (Supabase uniquement)
/actions      → Server Actions
/validators   → Schémas Zod
/types        → Types partagés
```

## Setup

### 1. Variables d'environnement

```bash
cp .env.example .env.local
```

Renseignez dans `.env.local` :
- `NEXT_PUBLIC_SUPABASE_URL` : URL du projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anon du projet

### 2. Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez les migrations SQL dans l’ordre :
   - `supabase/migrations/00001_initial_schema.sql`
   - `supabase/migrations/00002_rls_policies.sql`
   - `supabase/migrations/00003_profile_on_signup.sql` (optionnel)

3. Dans Authentication → URL Configuration :
   - Site URL : `http://localhost:3000` (dev)
   - Redirect URLs : `http://localhost:3000/**`

### 3. Premier utilisateur et workspace

Après inscription, créez manuellement un `profile` et un `workspace` (ou implémentez la page `/setup`) :

```sql
-- Exemple après un signup (remplacer USER_ID par l’id auth.users)
INSERT INTO profiles (id, email, full_name)
VALUES ('USER_ID', 'user@example.com', 'Nom');
INSERT INTO workspaces (name, owner_id) VALUES ('Mon activité', 'USER_ID');
```

### 4. Lancer le projet

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Fonctionnalités

- **Commandes** : client, articles, prix, statut, paiements partiels
- **Dépenses** : montant, catégorie (ingrédients, emballage, transport…), date
- **Clients** : nom, téléphone, notes
- **Tableau de bord** : profit quotidien, dette clients
- **Dettes clients** : calcul automatique (commandes - paiements)

## Architecture

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour le détail des couches et la prévention du débit technique.
