import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import MarkdownContent from "../components/MarkdownContent";

const Generic = ({ data }: PageProps<Queries.GenericPageQuery>) => {
  const html = data.markdownRemark?.html;
  invariant(html, "html is required");

  return (
    <Layout>
      <article>
        <MarkdownContent html={html} />
      </article>
    </Layout>
  );
};

export const Head = ({ data }: HeadProps<Queries.GenericPageQuery>) => (
  <SEO title={data.markdownRemark?.frontmatter?.title} />
);

export const query = graphql`
  query GenericPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      frontmatter {
        title
      }
      html
    }
  }
`;

export default Generic;
