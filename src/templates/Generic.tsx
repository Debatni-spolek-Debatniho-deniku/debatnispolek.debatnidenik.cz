import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

const Generic = (props: any) => {
  const page = props.data.markdownRemark;

  return (
    <div>
      <h1>{page.frontmatter.title}</h1>V url je :id hodnoty {props.params.id}
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
};

export const query = graphql`
  query GenericPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        template
        title
        # …whatever else you need
      }
      html
    }
  }
`;

console.log("THIS IS A QUERY", query); //kde je kurva tohle

export default Generic;
