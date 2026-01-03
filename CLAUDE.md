# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

This is a **Gatsby.js 5** static site generator project for a Czech debate club website (Debatni spolek Debatniho deniku). It's a single-page application built with React and TypeScript, using Bootstrap for styling and Azure Maps for location visualization.

## Tech Stack

- **Framework**: Gatsby 5.14.1 (React-based static site generator)
- **Language**: TypeScript 5.3.3
- **UI Library**: React 18.2.0
- **Styling**: Bootstrap 5.3.8
- **Maps**: Azure Maps Control 3.7.2
- **Content**: Markdown with MDX support
- **Deployment**: Azure Static Web Apps

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx       # Main layout wrapper (header, nav, footer)
│   ├── HeroSection.tsx  # Hero banner component
│   ├── AboutSection.tsx # About section
│   ├── WhyDebateSection.tsx
│   ├── AboutClubSection.tsx
│   └── RulesSection.tsx
├── pages/               # Gatsby auto-routed pages
│   ├── index.tsx        # Home page (/)
│   ├── 404.tsx          # Not found page
│   └── nav.json         # Navigation structure
├── templates/           # Templates for dynamic pages
│   ├── Generic.tsx      # Club page template (with map)
│   └── ActuallyGeneric.tsx  # Simple content template
├── content/             # Markdown content files
│   └── generic*.md      # Club pages content
├── styles/
│   └── bootstrap.css    # Bootstrap overrides
└── helpers.ts           # Utility functions
```

## Key Files

| File | Purpose |
|------|---------|
| `gatsby-config.ts` | Gatsby plugins and site configuration |
| `gatsby-node.ts` | Build-time page generation from markdown |
| `gatsby-browser.js` | Client-side Bootstrap imports |
| `src/pages/nav.json` | Navigation menu structure |
| `static/staticwebapp.config.json` | Azure deployment config |

## Commands

```bash
npm run develop    # Start dev server with hot reload
npm run build      # Type check + production build
npm run typecheck  # TypeScript validation only
npm run serve      # Serve built site locally
npm run clean      # Clear Gatsby cache
```

## Routing

- **File-based routing**: Pages in `src/pages/` are auto-routed
- **Dynamic pages**: Created at build time via `gatsby-node.ts` from markdown files in `src/content/`
- **Route pattern**: Markdown frontmatter `path` field defines the URL

### Markdown Frontmatter Schema

```yaml
title: Page Title
path: /generic/1
template: generic | actuallyGeneric
lat: 50.08547631981888      # Optional: for map
lon: 14.431331308140502     # Optional: for map
info:                       # Optional: club info
  - Line 1
  - Line 2
owner:                      # Optional: club owners
  - name: Person Name
    email: email@example.com
    image: /path/to/image.jpg
```

## Architecture Patterns

### Layout Pattern
All pages use the `Layout` component wrapper which provides:
- Sticky header with navigation
- Footer with contact info
- Navigation highlighting via `@reach/router` location

### Data Flow
1. Markdown files in `src/content/` define content
2. `gatsby-node.ts` queries markdown at build time
3. Pages are generated using appropriate template
4. GraphQL queries in components fetch page-specific data

### Azure Maps Integration
- Loaded client-side only (SSR check: `typeof window === "undefined"`)
- Map instance managed via `useRef` to prevent recreation
- Cleanup handled in `useEffect` return function

## Conventions

- **Assertion helper**: Use `assert()` from `src/helpers.ts` for null-safety checks
- **Styling**: Use Bootstrap utility classes; custom CSS in `src/styles/bootstrap.css`
- **Images**: Place in `static/` for direct reference or use gatsby-plugin-image for optimization
- **Navigation**: Update `src/pages/nav.json` to modify menu structure

## GraphQL

Gatsby uses GraphQL for data queries. Types are auto-generated in `src/gatsby-types.d.ts`.

Example page query:
```typescript
export const query = graphql`
  query GenericPage($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        lat
        lon
      }
    }
  }
`
```

## Build Output

- Output directory: `public/`
- Fully static HTML/CSS/JS
- Deployable to any static host
- Current deployment: Azure Static Web Apps

## Notes

- The site is in Czech language
- Content is primarily static with minimal interactivity
- Maps are the main interactive feature (club locations)
