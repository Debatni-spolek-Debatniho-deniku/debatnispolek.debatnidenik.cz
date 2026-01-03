# Copilot Instructions for debatnispolek.debatnidenik.cz

## Project Overview
- **Gatsby 5** static site for a Czech debate club, using React (TypeScript), Bootstrap, and Markdown/YAML content.
- Content and navigation are managed by editors in `src/content/` (Markdown, images, nav.yml).
- Pages are generated at build time from Markdown using templates in `src/templates/`.
- Deployment is to Azure Static Web Apps; output is in `public/`.

## Key Structure
- `src/components/`: Shared React components (see `Layout.tsx` for global structure)
- `src/pages/`: File-based routed pages (e.g., `index.tsx`, `404.tsx`)
- `src/templates/`: Templates for dynamic pages (e.g., `Generic.tsx`, `Club.tsx`)
- `src/content/`: Markdown content, images, and `nav.yml` (navigation)
- `gatsby-config.ts`, `gatsby-node.ts`: Gatsby configuration and dynamic page creation

## Data & Routing
- **Markdown frontmatter** defines page metadata and routing (`path`, `template`, etc.)
- **Navigation** is defined in `src/content/nav.yml` (YAML, queryable via GraphQL)
- **Dynamic pages**: Created from Markdown by `gatsby-node.ts` using templates

## Developer Workflows
- **Do NOT run** `npm run develop`, `npm run build`, or `npm run serve` (handled by the programmer)
- Use only code changes; let the programmer handle running/testing
- Key scripts (for reference):
  - `npm run develop`: Dev server
  - `npm run build`: Type check + build
  - `npm run typecheck`: TypeScript only
  - `npm run clean`: Clear Gatsby cache

## Conventions & Patterns
- **Assertions**: Use `invariant()` from `tiny-invariant` for null-safety
- **Defensive programming**: Assert all non-optional values; use `?.` for safe property access
- **Styling**: Prefer Bootstrap utility classes; custom CSS only as needed
- **Images**:
  - In `src/content/`: Referenced in Markdown, processed by Gatsby
  - In `static/`: Used directly in React components
- **All pages** use the `Layout` component for header/nav/footer

## GraphQL
- Use GraphQL queries in templates/components to fetch Markdown/YAML data
- Types auto-generated in `src/gatsby-types.d.ts`

## Integration Points
- Maps are embedded as iframes (no direct JS map API)
- Azure Static Web Apps config in `static/staticwebapp.config.json`

## Notes
- Site language is Czech
- Editors manage only `src/content/` and `nav.yml` (these files are always present)
- Minimal interactivity; focus is on static content and navigation

---
If you update this file, also update `CLAUDE.md` to keep AI guidance in sync.
