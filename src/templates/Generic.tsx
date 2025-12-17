import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { assert } from "../helpers";

const Generic = (props: PageProps<Queries.GenericPageQuery>) => {
  const page = props.data.markdownRemark;

  assert(page?.frontmatter, "Front matter is not set.");
  assert(page?.html, "Html is not set.");

  return <main dangerouslySetInnerHTML={{ __html: page.html }} />;
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

export default Generic;
