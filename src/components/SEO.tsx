import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

interface SEOProps {
  title?: string | null;
  description?: string | null;
  children?: React.ReactNode;
}

const SEO = ({ title, description, children }: SEOProps) => {
  const { site } = useStaticQuery<Queries.SEOQuery>(graphql`
    query SEO {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const siteTitle = site?.siteMetadata?.title ?? "";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <>
      <link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {children}
    </>
  );
};

export default SEO;
