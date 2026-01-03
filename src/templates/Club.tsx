import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const Club = ({ data }: PageProps<Queries.ClubPageQuery>) => {
  return (
    <Layout>
      <article
        dangerouslySetInnerHTML={{ __html: data.markdownRemark?.html ?? "" }}
      />
    </Layout>
  );
};

export const Head = ({ data }: HeadProps<Queries.ClubPageQuery>) => (
  <SEO title={data.markdownRemark?.frontmatter?.title} />
);

export const query = graphql`
  query ClubPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      frontmatter {
        title
      }
      html
    }
  }
`;

export default Club;
