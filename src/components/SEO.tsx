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
          siteUrl
        }
      }
    }
  `);

  const siteTitle = site?.siteMetadata?.title ?? "";
  const siteUrl = site?.siteMetadata?.siteUrl ?? "";
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
      <meta property="og:site_name" content={siteTitle} />
      {description && <meta name="description" content={description} />}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: siteTitle,
              url: siteUrl,
            },
            {
              "@type": "Organization",
              name: siteTitle,
              url: siteUrl,
              logo: `${siteUrl}/NavLogo_full.svg`,
              sameAs: ["https://discord.gg/qpp8v52AgP"],
            },
          ],
        })}
      </script>
      {children}
    </>
  );
};

export default SEO;
