import * as React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";

const Club = (props: PageProps) => {
  //const page = props.data.markdownRemark;

  return (
    <Layout>
      <div>Club template placeholder</div>
    </Layout>
  );
};

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
