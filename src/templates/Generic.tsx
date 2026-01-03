import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const Generic = (props: PageProps<Queries.GenericPageQuery>) => {
  //const page = props.data.markdownRemark;

  return (
    <Layout>
      <div>Generic template placeholder</div>
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
