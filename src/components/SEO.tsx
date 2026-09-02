import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

interface SEOProps {
  title?: string | null;
  description?: string | null;
  pathname?: string;
  image?: string | null;
  noindex?: boolean;
  includeLocalOrg?: boolean;
  children?: React.ReactNode;
}

const SEO = ({
  title,
  description,
  pathname,
  image,
  noindex = false,
  includeLocalOrg = false,
  children,
}: SEOProps) => {
  const { site } = useStaticQuery<Queries.SEOQuery>(graphql`
    query SEO {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  const siteTitle = site?.siteMetadata?.title ?? "";
  const siteDescription = site?.siteMetadata?.description ?? "";
  const siteUrl = site?.siteMetadata?.siteUrl ?? "";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || siteDescription;
  const canonicalUrl = `${siteUrl}${pathname || "/"}`;
  const socialImage = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.png`;

  const schemaGraph: any[] = [
    {
      "@type": "WebSite",
      name: siteTitle,
      url: siteUrl,
    },
    {
      "@type": "Organization",
      name: siteTitle,
      description: metaDescription,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: ["https://discord.gg/qpp8v52AgP"],
    },
  ];

  if (includeLocalOrg) {
    schemaGraph.push({
      "@type": "EducationalOrganization",
      name: "Debatní klub Praha – Debatní spolek Debatního deníku",
      description:
        "Otevřený debatní klub v Praze na ČVUT. Naučíme vás argumentovat, pohotově reagovat a mluvit před lidmi – zdarma a pro každého.",
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Thákurova 2700/9",
        addressLocality: "Praha",
        addressRegion: "Praha 6 – Dejvice",
        postalCode: "160 00",
        addressCountry: "CZ",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 50.105,
        longitude: 14.3894,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Monday",
          opens: "18:00",
          closes: "21:00",
          description: "Debatní klub Praha (ČVUT, Dejvice)",
        },
      ],
      sameAs: ["https://discord.gg/qpp8v52AgP"],
      parentOrganization: {
        "@type": "Organization",
        name: siteTitle,
        url: siteUrl,
      },
    });
  }

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
      <link rel="canonical" href={canonicalUrl} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      {!noindex && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": schemaGraph,
          })}
        </script>
      )}
      {children}
    </>
  );
};

export default SEO;
