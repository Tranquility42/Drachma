# Drachma

Registre budgétaire personnel — mensuel et annuel — utilisé comme projet de pratique CI/CD et pièce de portfolio.

## Stack

- **Next.js 16** (App Router, TypeScript) — Server Actions pour toutes les mutations, aucun accès direct au client vers la base de données.
- **Supabase** (Postgres + Row Level Security) — chaque ligne est scopée par utilisateur.
- **Clerk** — authentification, connecté à Supabase via Third-Party Auth (le JWT Clerk est vérifié nativement par Postgres, `auth.jwt()->>'sub'` dans les policies RLS).
- **Tailwind CSS v4** — thème visuel porté depuis la maquette statique d'origine (`legacy/budget.html`).
- **PWA** — installable, shell mis en cache hors-ligne (`public/sw.js`).
- **Vercel** — déploiement, previews par PR.
- **GitHub Actions** — lint, typecheck, tests, build sur chaque PR.

## Démarrage local

1. Copier `.env.local.example` vers `.env.local`.
2. Récupérer les clés Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) depuis le dashboard Supabase (projet `drachma`).
3. Lier Clerk au projet :
   ```bash
   npx clerk@latest init --framework next
   ```
   Ceci écrit `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY` dans `.env.local`.
4. Dans le dashboard Supabase, activer **Authentication → Sign In / Providers → Third Party Auth → Clerk** avec le domaine Clerk du projet, pour que les policies RLS puissent vérifier le JWT.
5. Installer les dépendances et lancer le serveur de dev :
   ```bash
   npm install
   npm run dev
   ```

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |

## Architecture

```
src/
  app/                  Routes (App Router)
    (auth)/             Pages de connexion/inscription (Clerk)
    page.tsx            Tableau de bord (protégé par proxy.ts)
    manifest.ts          Manifest PWA
  features/
    budget/
      types.ts           Types + schémas de validation (Zod)
      calculations.ts     Logique pure (totaux) — testée unitairement
      queries.ts          Lecture des données (server-only, DAL)
      actions.ts           Server Actions (mutations, auth vérifiée à chaque appel)
      components/          UI du registre budgétaire
  lib/
    dal.ts              Vérification de session (Clerk), point d'entrée unique
    supabase/
      server.ts          Client Supabase server-only, authentifié via le token Clerk
      database.types.ts   Types générés depuis le schéma Supabase
supabase/
  migrations/           Schéma SQL versionné (source de vérité : Supabase MCP)
```

Toute nouvelle fonctionnalité doit suivre ce découpage : logique métier pure et testable dans `calculations.ts`, accès aux données dans `queries.ts`/`actions.ts` (jamais directement dans un composant), UI dans `components/`.

## Sécurité

- RLS activé sur toutes les tables dès la création du schéma.
- Aucun accès Supabase depuis le navigateur — uniquement Server Components et Server Actions.
- Chaque Server Action revérifie l'authentification et la propriété de la ressource (jamais de confiance dans l'UI seule).
- Secrets uniquement en variables d'environnement (`.env.local`, secrets Vercel/GitHub Actions) — jamais commités.
