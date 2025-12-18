import * as React from "react";
import { useEffect, useRef } from "react";
import { graphql, PageProps } from "gatsby";
import { assert } from "../helpers";
import * as atlas from "azure-maps-control";
import Layout from "../components/Layout";

const ActuallyGeneric = (props: PageProps<Queries.GenericPageQuery>) => {
  const page = props.data.markdownRemark;

  assert(page?.frontmatter, "Front matter is not set.");
  assert(page?.html, "Html is not set.");

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 offset-1 pt-5">
            {page.frontmatter?.title && <h1>{page.frontmatter.title}</h1>}
            <main dangerouslySetInnerHTML={{ __html: page.html }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

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

export default ActuallyGeneric;
