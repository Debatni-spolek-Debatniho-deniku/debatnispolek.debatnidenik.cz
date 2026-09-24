import type { GatsbyConfig } from "gatsby";
import * as dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
dotenv.config({
  path: `.env`,
});
dotenv.config({
  path: `.env.production`,
});

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Debatní spolek Debatního deníku`,
    description: `Přidejte se do debatního klubu v Praze na ČVUT nebo v Plzni. Naučíme vás argumentovat a mluvit před lidmi – zdarma, pro každého.`,
    siteUrl: `https://debatnispolek.debatnidenik.cz`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-yaml-full",
      options: {
        plugins: ["gatsby-yaml-full-markdown"],
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
          "gatsby-remark-autolink-headers",
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./src/content",
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        resolveSiteUrl: () => "https://debatnispolek.debatnidenik.cz",
        excludes: [
          "/casto-kladene-dotazy",
          "/casto-kladene-dotazy/",
          "/404",
          "/404/",
          "/404.html",
        ],
        serialize: (node: { path: string }) => {
          let priority = 0.7;
          let changefreq = "weekly";
          if (node.path === "/") {
            priority = 1.0;
            changefreq = "daily";
          } else if (node.path.startsWith("/clubs/")) {
            priority = 0.9;
            changefreq = "weekly";
          } else if (node.path === "/faq/" || node.path === "/faq") {
            priority = 0.8;
            changefreq = "monthly";
          } else if (node.path === "/akce/" || node.path === "/akce") {
            priority = 0.9;
            changefreq = "daily";
          }
          return {
            url: node.path,
            changefreq,
            priority,
          };
        },
      },
    },
  ],
};

export default config;

