# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build + generate sitemap
npm run lint         # Check for lint errors
npm run lint:fix     # Auto-fix lint errors
npm run sitemap      # Regenerate sitemap only
```

No test suite is configured in this project.

Pre-commit hook runs `lint:fix` automatically on staged `src/**/*.{ts,tsx}` files via Husky + lint-staged.

## Architecture

**Bobbieleelicious** is a lifestyle/recipe blog built on **Next.js 14 with the Pages Router** (not App Router). Content is managed in **Contentful CMS** and fetched at build time via `getStaticProps`/`getStaticPaths` with ISR (`revalidate: 86400`).

### Key directories

- `src/pages/` — Routes: `index.tsx`, `about/`, `blogs/`, `blog/[slug].tsx`, `recipes/`, `recipe/[slug].tsx`, `api/subscribe/`
- `src/components/` — Feature components, each in its own folder. `RecipeController/` and `BlogController/` are the main content-display containers
- `src/lib/index.ts` — All Contentful API queries (`getAllBlogs`, `getAllRecipes`, etc.)
- `src/store/search-context.tsx` — React Context for global search/filter state
- `src/styles/` — Global SCSS (`main.scss` imports partials: `_color-palette`, `_variables`, `_breakpoints`, `_animations`)

### Styling

SCSS modules (`.module.scss`) for component-scoped styles. Global SCSS variables are in `src/styles/_variables.scss` and `_color-palette.scss`. Path aliases: `@styles/*`, `@components/*`, `@data/*`.

### Third-party integrations

| Service | Purpose |
|---|---|
| Contentful | Headless CMS — all blog/recipe content |
| Mailchimp | Newsletter via `/api/subscribe` API route |
| Supabase | Reviews (recipes) + comments (blog posts) via `/api/reviews/[slug]` and `/api/comments/[slug]` |
| Facebook SDK | Social sharing (initialized in `_document.tsx`) |
| Google Analytics | Tracking via `src/lib/gtag.tsx` + route change events in `_app.tsx` |
| Vercel Analytics | Performance metrics |

### Environment variables

Required in `.env.local`:
- `NEXT_CONTENTFUL_SPACE_ID`, `NEXT_CONTENTFUL_ACCESS_TOKEN`, `NEXT_CONTENTFUL_PREVIEW_ACCESS_TOKEN`, `NEXT_CONTENTFUL_PREVIEW_SECRET`
- `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`
- `BASE_URL` — canonical domain (e.g. `https://www.bobbieleelicious.com`)
- `GA_TRACKING_ID`, `FACEBOOK_APP_ID`, `FACEBOOK_USER_ID_1`, `FACEBOOK_USER_ID_2`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — used server-side only in API routes

### Special page behavior

The `Layout` component (wraps all pages with Nav + Footer) is **skipped** for `/print` routes — checked in `_app.tsx`.

### Sitemap

`scripts/generate-sitemap.js` runs after `next build` and writes `public/sitemap.xml` by querying Contentful for all blog/recipe slugs. Dynamic route placeholders (`[slug]`) are excluded.

## Code style

- Single quotes, no semicolons, 100-char print width (Prettier)
- TypeScript strict mode off, but `strictNullChecks` enabled
- No PropTypes — TypeScript interfaces used instead
- `react/react-in-jsx-scope` disabled — no need to `import React`
