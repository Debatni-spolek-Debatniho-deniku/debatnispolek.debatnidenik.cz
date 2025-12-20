import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <main className="container my-5">
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1 style={{ fontSize: "4rem", color: "#e61a2c", margin: 0 }}>404</h1>
          <h2 style={{ marginTop: "0.5rem" }}>Page not found</h2>
          <p>Sorry, we couldn’t find the page you were looking for.</p>
          <Link to="/" className="btn-getstarted" style={{ marginTop: "1rem" }}>
            Go back home
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export const Head = () => <title>404: Not found</title>;

export default NotFoundPage;
