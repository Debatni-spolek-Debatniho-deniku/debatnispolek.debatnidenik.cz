import * as React from 'react'
import { graphql } from 'gatsby'

const Generic = ({ data }:any) => {
  const page = data.markdownRemark

  return (
    <div>
      <h1>{page.frontmatter.title}</h1>

      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  )
}
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
`
console.log("THIS IS A QUERY", query) //kde je kurva tohle

export default Generic;