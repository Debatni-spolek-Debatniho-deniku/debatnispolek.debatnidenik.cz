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
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {children}
    </>
  );
};

export default SEO;
