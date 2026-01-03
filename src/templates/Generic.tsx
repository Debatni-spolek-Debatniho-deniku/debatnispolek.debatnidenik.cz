import * as React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";

const Generic = (props: PageProps) => {
  //const page = props.data.markdownRemark;

  return (
    <Layout>
      <div>Generic template placeholder</div>
    </Layout>
  );
};

export const query = graphql`
  query GenericPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      frontmatter {
        title
        lat
        lon
        info
        owner {
          name
          email
          image
        }
      }
      html
    }
  }
`;

export default Generic;
