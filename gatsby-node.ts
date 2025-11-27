import { GatsbyNode } from "gatsby";
import path from "path";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;

  const createPagesQuery = await graphql<Queries.CreatePagesQuery>(`
    query CreatePages {
      allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "generic" } } }
      ) {
        nodes {
          id
          frontmatter {
            title
            path
            template
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  `);

  createPagesQuery!.data!.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: node!.frontmatter!.path!,
      component: path.resolve("./src/templates/Generic.tsx"),
      context: {
        id: node.id, // IMPORTANT
        jsemFaktGay: "name" in node.parent! ? node.parent.name! : "nejsem gay",
      },
    });
  });
};
