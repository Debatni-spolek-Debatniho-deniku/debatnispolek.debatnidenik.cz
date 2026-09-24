import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import MarkdownContent from "../components/MarkdownContent";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

export default function Club({ data }: PageProps<Queries.ClubPageQuery>) {
  const html = data.markdownRemark?.html;
  invariant(html, "html is required");

  const currentPath = data.markdownRemark?.frontmatter?.path;
  const clubData = data.allClubsClubsYaml.nodes.find(
    (club) => club.path === currentPath
  );
  const locations = clubData?.location
    ? [clubData.location]
    : data.markdownRemark?.frontmatter?.locations;
  invariant(locations, "locations is required");

  const owners = clubData?.owners ?? data.markdownRemark?.frontmatter?.owners;
  invariant(owners, "owners is required");

  return (
    <Layout>
      <article className="row">
        <MarkdownContent html={html} className="col-lg-8" />
        <aside className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Status Section */}
              {clubData?.status && (
                <div className="mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-uppercase fw-bold text-muted">
                      Status klubu
                    </span>
                    <span
                      className={`badge ${
                        clubData.status.badgeClass || "bg-success"
                      } rounded-pill px-3 py-1`}
                    >
                      <i
                        className="bi bi-circle-fill me-1"
                        style={{ fontSize: "0.5rem" }}
                      ></i>
                      {clubData.status.label}
                    </span>
                  </div>
                  {clubData.status.note && (
                    <div className="small text-muted bg-light p-2 rounded">
                      <i className="bi bi-info-circle me-1 text-primary"></i>
                      {clubData.status.note}
                    </div>
                  )}
                </div>
              )}

              {/* Meeting Time Section */}
              {clubData?.meeting && (
                <div className="mb-4 pb-3 border-bottom">
                  <span className="small text-uppercase fw-bold text-muted d-block mb-1">
                    Pravidelná setkání
                  </span>
                  <div className="h6 fw-bold text-primary mb-0">
                    <i className="bi bi-clock-fill me-2"></i>
                    {clubData.meeting.fullWhen}
                  </div>
                </div>
              )}

              {/* Locations Section */}
              <div className="mb-4 pb-3 border-bottom">
                <span className="small text-uppercase fw-bold text-muted d-block mb-2">
                  Kde se scházíme
                </span>
                {locations.map((location, index) => {
                  invariant(location, "location is required");
                  return (
                    <div key={index} className={index > 0 ? "mt-3" : ""}>
                      <h6 className="card-title fw-bold mb-2">
                        {location.name}
                      </h6>
                      {location.info && (
                        <ul className="list-unstyled mb-3">
                          {location.info.map((line, lineIndex) => (
                            <li
                              key={lineIndex}
                              className="small text-muted mb-1"
                            >
                              <i className="bi bi-geo-alt-fill me-1 text-secondary"></i>
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                      {location.map && (
                        <div
                          className="club-map mt-2"
                          dangerouslySetInnerHTML={{ __html: location.map }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Owners Section */}
              <div>
                <span className="small text-uppercase fw-bold text-muted d-block mb-3">
                  Odpovědné osoby
                </span>
                {(() => {
                  const isOdd = owners.length % 2 === 1;
                  const firstOwner = isOdd ? owners[0] : null;
                  const remainingOwners = isOdd ? owners.slice(1) : owners;

                  const renderOwner = (owner: (typeof owners)[number]) => {
                    invariant(owner?.name, "owner name is required");

                    const image = getImage(owner.image as ImageDataLike);
                    invariant(image, "owner image is required");

                    invariant(owner?.email, "owner email is required");
                    invariant(owner?.discord, "owner discord is required");
                    const role = (owner as any)?.role;

                    return (
                      <div
                        key={owner.name}
                        className="text-center small club-owner"
                      >
                        <GatsbyImage
                          image={image}
                          alt={owner.name ?? ""}
                          className="rounded-circle mb-2 club-owner-profile-picture"
                        />
                        <div className="fw-bold">{owner.name}</div>
                        {role && (
                          <div
                            className="text-muted small mb-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {role}
                          </div>
                        )}
                        <a
                          href={`mailto:${owner.email}`}
                          className="d-block text-truncate"
                        >
                          {owner.email}
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(owner.discord!);
                          }}
                          title="Zkopírovat do schránky"
                          className="text-muted text-decoration-none d-inline-block py-1"
                        >
                          <small>
                            <i className="bi bi-discord me-1"></i>
                            {owner.discord}
                          </small>
                        </a>
                      </div>
                    );
                  };

                  return (
                    <>
                      {firstOwner && (
                        <div className="d-flex justify-content-center mb-4">
                          {renderOwner(firstOwner)}
                        </div>
                      )}
                      <div className="d-flex flex-wrap justify-content-around gap-4">
                        {remainingOwners.map((owner) => renderOwner(owner))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </aside>
      </article>
    </Layout>
  );
}

export const Head = ({ data }: HeadProps<Queries.ClubPageQuery>) => (
  <SEO
    title={data.markdownRemark?.frontmatter?.title}
    pathname={data.markdownRemark?.frontmatter?.path || undefined}
    description={(data.markdownRemark as any)?.excerpt}
    includeLocalOrg={data.markdownRemark?.frontmatter?.path === "/clubs/prague"}
  />
);

export const query = graphql`
  query ClubPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      excerpt(pruneLength: 160)
      frontmatter {
        title
        path
        locations {
          name
          info
          map
        }
        owners {
          name
          email
          discord
          image {
            childImageSharp {
              gatsbyImageData(width: 160, height: 160, placeholder: BLURRED)
            }
          }
        }
      }
      html
    }
    allClubsClubsYaml {
      nodes {
        name
        city
        path
        status {
          label
          type
          badgeClass
          note
        }
        meeting {
          day
          time
          frequency
          fullWhen
        }
        location {
          name
          address
          room
          map
          info
        }
        owners {
          name
          email
          discord
          role
          image {
            childImageSharp {
              gatsbyImageData(width: 160, height: 160, placeholder: BLURRED)
            }
          }
        }
      }
    }
  }
`;
