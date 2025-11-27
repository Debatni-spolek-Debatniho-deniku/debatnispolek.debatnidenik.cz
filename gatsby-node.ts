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
              sourceInstanceName
            }
          }
        }
      }
    }
  `);

  const indexPageNode = createPagesQuery.data!.allMarkdownRemark!.nodes.find(
    (node) =>
      "sourceInstanceName" in node.parent! &&
      node.parent.sourceInstanceName == "index"
  )!;

  const clubPageNodes =
    createPagesQuery.data!.allMarkdownRemark!.nodes.filter(
      (node) =>
        "sourceInstanceName" in node.parent! &&
        node.parent.sourceInstanceName == "clubs"
    )! ?? [];

  createPage({
    path: `/`,
    component: path.resolve("./src/templates/generic.tsx"),
    context: {
      id: indexPageNode.id,
    },
  });

  for (const clubNode of clubPageNodes) {
    createPage({
      path: clubNode.frontmatter!.path!,
      component: path.resolve("./src/templates/clubs.tsx"),
      context: {
        id: clubNode.id,
        navTitle: clubNode.frontmatter!.title,
      },
    });
  }
    createPagesQuery.data.allMarkdownRemark.nodes.forEach(node => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/Generic.tsx"),
      context: {
        id: node.id, // IMPORTANT
      },
    })
  });
};
