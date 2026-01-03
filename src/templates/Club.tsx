import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const Club = ({ data }: PageProps<Queries.ClubPageQuery>) => {
  const html = data.markdownRemark?.html;
  invariant(html, "html is required");
  const locations = data.markdownRemark?.frontmatter?.locations;
  invariant(locations, "locations is required");
  const owners = data.markdownRemark?.frontmatter?.owners;
  invariant(owners, "owners is required");

  return (
    <Layout>
      <article className="row">
        <div
          className="col-md-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <aside className="col-md-4">
          <div className="card">
            <div className="card-body">
              {/* Locations Section */}
              {locations.map((location, index) => {
                invariant(location, "location is required");
                return (
                  <div key={index} className={index > 0 ? "mt-4" : ""}>
                    <h5 className="card-title">{location.name}</h5>
                    {location.info && (
                      <ul className="list-unstyled mb-3">
                        {location.info.map((line, lineIndex) => (
                          <li key={lineIndex}>{line}</li>
                        ))}
                      </ul>
                    )}
                    {location.map && (
                      <div
                        className="ratio ratio-4x3"
                        dangerouslySetInnerHTML={{ __html: location.map }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Owners Section */}
              <div className="mt-4">
                <hr />
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  {owners.map((owner, index) => {
                    invariant(owner?.picture?.publicURL, "owner picture is required");
                    return (
                      <div key={index} className="text-center">
                        <img
                          src={owner.picture.publicURL}
                          alt={owner.name ?? ""}
                          className="rounded-circle mb-2"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                        <div className="fw-bold">{owner.name}</div>
                        {owner.email && (
                          <a href={`mailto:${owner.email}`}>{owner.email}</a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </article>
    </Layout>
  );
};

export const Head = ({ data }: HeadProps<Queries.ClubPageQuery>) => (
  <SEO title={data.markdownRemark?.frontmatter?.title} />
);

export const query = graphql`
  query ClubPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      frontmatter {
        title
        locations {
          name
          info
          map
        }
        owners {
          name
          email
          picture {
            publicURL
          }
        }
      }
      html
    }
  }
`;

export default Club;
