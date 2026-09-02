import React from "react";
import { graphql, PageProps } from "gatsby";
import SEO from "../components/SEO";
import FAQPage from "./faq";

export default FAQPage;

export const Head = ({ data }: PageProps<Queries.CastoKladeneDotazyPageQuery>) => {
  const faqData = data.faqYaml;
  const faqJsonLd = faqData?.questions
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.questions
          .filter((q) => q?.question && q?.answer?.html)
          .map((q) => ({
            "@type": "Question",
            name: q!.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q!.answer!.html!.replace(/<[^>]*>?/gm, ""),
            },
          })),
      }
    : null;

  return (
    <SEO
      title="Často kladené otázky o debatním klubu"
      description="Odpovědi na nejčastější otázky o debatním klubu v Praze a Plzni – jak se přihlásit, co očekávat při první návštěvě, věkové omezení, členství a další."
      pathname="/faq/"
    >
      {faqJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      )}
    </SEO>
  );
};

export const query = graphql`
  query CastoKladeneDotazyPage {
    faqYaml {
      title
      subtitle
      categories {
        id
        label
        icon
      }
      questions {
        id
        category
        icon
        question
        answer {
          html
        }
        tip
      }
    }
  }
`;
