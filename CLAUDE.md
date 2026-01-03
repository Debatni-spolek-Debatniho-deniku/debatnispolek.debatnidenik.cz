# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

This is a **Gatsby.js 5** static site generator project for a Czech debate club website (Debatni spolek Debatniho deniku). It's a single-page application built with React and TypeScript, using Bootstrap for styling and Azure Maps for location visualization.

## Tech Stack

- **Framework**: Gatsby 5.14.1 (React-based static site generator)
- **Language**: TypeScript 5.3.3
- **UI Library**: React 18.2.0
- **Styling**: Bootstrap 5.3.8
- **Maps**: Embedded as iframes
- **Content**: Markdown with gatsby-transformer-remark
- **Navigation**: YAML with gatsby-transformer-yaml
- **Deployment**: Azure Static Web Apps

## Project Structure

```
src/
├── components/          # Reusable React components
│   └── Layout.tsx       # Main layout wrapper (header, nav, footer)
├── pages/               # Gatsby auto-routed pages
│   ├── index.tsx        # Home page (/)
│   └── 404.tsx          # Not found page
├── templates/           # Templates for dynamic pages
│   ├── Generic.tsx      # Generic content template
│   └── Club.tsx         # Club page template (with map)
└── content/             # Content files (managed by editors)
    ├── nav.yml          # Navigation structure (GraphQL queryable)
    └── *.md             # Markdown content pages
```

## Key Files

| File | Purpose |
|------|---------|
| `gatsby-config.ts` | Gatsby plugins and site configuration |
| `gatsby-node.ts` | Build-time page generation from markdown |
| `gatsby-browser.js` | Client-side Bootstrap imports |
| `src/content/nav.yml` | Navigation menu structure (GraphQL queryable) |
| `static/staticwebapp.config.json` | Azure deployment config |

## Commands

```bash
npm run develop    # Start dev server with hot reload
npm run build      # Type check + production build
npm run typecheck  # TypeScript validation only
npm run serve      # Serve built site locally
npm run clean      # Clear Gatsby cache
```

**Important**: Do NOT run `npm run develop`, `npm run build`, or `npm run serve` commands. The programmer runs the dev server in a separate terminal window. Only make code changes and let the programmer handle running/testing.

## Routing

- **File-based routing**: Pages in `src/pages/` are auto-routed
- **Dynamic pages**: Created at build time via `gatsby-node.ts` from markdown files in `src/content/`
- **Route pattern**: Markdown frontmatter `path` field defines the URL

### Markdown Frontmatter Schema

Schema for `generic` template looks like:

```yaml
title: Page Title
path: /page-path
template: generic
```

Schema for `club` template looks like:

```yaml
title: Page Title
path: /page-path
template: club

locations:
  - name: Location Name
    info: # optional
      - First row of ino
      - Second row of info
      - Third row of info
    map: <iframe src="some iframe /> # optional

owners:
  - name: John Doe
    picture: ./owners/JohnDoe.png
    email: johndoe@x.com
  - name: Jane Doe
    picture: ./owners/JaneDoe.png
    email: janedoe@x.com
```

### Navigation YAML Schema

Navigation is defined in `src/content/nav.yml` and queryable via GraphQL:

```yaml
- label: Home
  path: /
- label: Section Name
  items:
    - label: Child Page
      path: /child-path
```

Query navigation with:
```graphql
query {
  allNavYaml {
    nodes {
      label
      path
      items {
        label
        path
      }
    }
  }
}
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
3. Pages are generated using appropriate template (`generic` or `club`)
4. GraphQL queries in components fetch page-specific data

## Conventions

- **Assertions**: Use `invariant()` from `tiny-invariant` for null-safety checks
- **Offensive programmer**: Assert everything that can be null/undefined for it not being as such unless specified that something is optional, you can benefit from ? operator as asserting child property also asserts existence of parent property
- **Styling**: Use Bootstrap utility classes; custom CSS as needed
- **Images**:
  - `src/content/`: Images managed by editors, referenced from markdown files, processed by gatsby-remark-images
  - `static/`: Images used directly in React components via `<img>` tag, managed by programmers
- **Navigation**: Update `src/content/nav.yml` to modify menu structure

## GraphQL

Gatsby uses GraphQL for data queries. Types are auto-generated in `src/gatsby-types.d.ts`.

Example page query:
```typescript
export const query = graphql`
  query GenericPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      html
      frontmatter {
        title
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
- Content in `src/content/` is managed by editors, editors add, change and remove md files and images, editors also change nav.yml but the file is always present and cannot be deleted by them
