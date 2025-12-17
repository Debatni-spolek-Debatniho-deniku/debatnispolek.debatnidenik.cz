import { GatsbyNode } from "gatsby";
import path from "path";
import { assert } from "./src/helpers";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;

  const createPagesQuery = await graphql<Queries.CreatePagesQuery>(`
    query CreatePages {
      allMarkdownRemark {
        nodes {
          id
          frontmatter {
            path
            template
          }
        }
      }
    }
  `);

  assert(createPagesQuery.data, "Data was not loaded!");

  createPagesQuery.data.allMarkdownRemark.nodes.forEach((node) => {
    assert(node?.frontmatter?.path, "Path is not set!");
    assert(node?.frontmatter?.template, "Template is not set!");

    createPage({
      path: node.frontmatter.path,
      component: getTemplateFileFromTemplateName(node.frontmatter.template),
      context: {
        markdownId: node.id, // IMPORTANT
      },
    });
  });
};

const getTemplateFileFromTemplateName = (templateName: string) => {
  switch (templateName) {
    case "generic":
      return path.resolve("./src/templates/Generic.tsx");
    default:
      throw new Error(`Unknown template ${templateName}!`);
  }
};
