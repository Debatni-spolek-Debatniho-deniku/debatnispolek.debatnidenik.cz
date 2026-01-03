import React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div>Page not found</div>
    </Layout>
  );
};

export const Head = () => <SEO title="Stránka nenalezena" />;

export default NotFoundPage;
