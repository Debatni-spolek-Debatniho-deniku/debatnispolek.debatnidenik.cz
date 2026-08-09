import { graphql } from "gatsby";
import FAQPage, { Head } from "./faq";

export default FAQPage;
export { Head };

export const query = graphql`
  query CastoKladeneDotazyPage {
    faqYaml {
      title
      subtitle
      categories {
        id
        label
        icon
      }
      questions {
        id
        category
        icon
        question
        answer {
          html
        }
        tip
      }
    }
  }
`;


