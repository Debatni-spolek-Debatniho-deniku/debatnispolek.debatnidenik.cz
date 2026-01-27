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
        <div className="col-md-8" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="col-md-4">
          <div className="card">
            <div className="card-body">
              {/* Locations Section */}
              {locations.map((location, index) => {
                invariant(location, "location is required");
                return (
                  <div key={index} className={index > 0 ? "mt-4" : ""}>
                    <h6 className="card-title">{location.name}</h6>
                    {location.info && (
                      <ul className="list-unstyled mb-3">
                        {location.info.map((line, lineIndex) => (
                          <li key={lineIndex} className="small text-muted">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                    {location.map && (
                      <div
                        className="club-map"
                        dangerouslySetInnerHTML={{ __html: location.map }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Owners Section */}
              <div className="mt-4">
                <h5 className="mb-3">Odpovědné osoby</h5>
                <div className="d-flex flex-wrap justify-content-around gap-4">
                  {owners.map((owner) => {
                    invariant(owner?.name, "owner name is required");
                    invariant(
                      owner?.image?.publicURL,
                      "owner image is required"
                    );
                    invariant(owner?.email, "owner email is required");
                    return (
                      <div
                        key={owner.name}
                        className="text-center small club-owner"
                      >
                        <img
                          src={owner.image.publicURL}
                          alt={owner.name ?? ""}
                          className="rounded-circle mb-2 club-owner-profile-picture"
                        />
                        <div className="fw-bold">{owner.name}</div>
                        <a
                          href={`mailto:${owner.email}`}
                          className="d-block text-truncate"
                        >
                          {owner.email}
                        </a>
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
          image {
            publicURL
          }
        }
      }
      html
    }
  }
`;

export default Club;
