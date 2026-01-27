import React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <h1 className="display-5 mb-3">Bohužel, tato stránka neexistuje :(</h1>
      </div>
    </Layout>
  );
};

export const Head = () => <SEO title="Stránka nenalezena" />;

export default NotFoundPage;
