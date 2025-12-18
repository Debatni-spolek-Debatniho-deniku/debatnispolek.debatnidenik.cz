import { graphql, PageProps } from "gatsby";
import React from "react";
import { assert } from "../helpers";
import Layout from "../components/Layout";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import WhyDebateSection from "../components/WhyDebateSection";
import AboutClubSection from "../components/AboutClubSection";
import RulesSection from "../components/RulesSection";

const Home: React.FC<PageProps<Queries.IndexPageQuery>> = (props) => {
  assert(props?.data?.allSitePage?.nodes, "Nodes not set!");

  console.log(props?.data?.allSitePage?.nodes);

  return (
    <Layout>
      <div className="container-fluid">
        <HeroSection />
        <AboutSection />
        <WhyDebateSection />
        <AboutClubSection />
        <RulesSection />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query IndexPage {
    allSitePage {
      nodes {
        path
        id
        pageContext
      }
    }
  }
`;

export default Home;
