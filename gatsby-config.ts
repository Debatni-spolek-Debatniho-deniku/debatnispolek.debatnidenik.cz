import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Debatní spolek Debatního deníku`,
    siteUrl: `https://debatnispolek.debatnidenik.cz`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
      },
    },
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "index",
        path: "./src/content/index.md",
      },
      __key: "index",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "clubs",
        path: "./src/content/clubs",
      },
      __key: "clubs",
    },
  ],
};

export default config;
