import * as React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

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
                {(() => {
                  const isOdd = owners.length % 2 === 1;
                  const firstOwner = isOdd ? owners[0] : null;
                  const remainingOwners = isOdd ? owners.slice(1) : owners;

                  const renderOwner = (owner: typeof owners[number]) => {
                    invariant(owner?.name, "owner name is required");

                    const image = getImage(owner.image as ImageDataLike);
                    invariant(image, "owner image is required");

                    invariant(owner?.email, "owner email is required");
                    invariant(owner?.discord, "owner discord is required");
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
                          className="text-muted text-decoration-none"
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
          discord
          image {
            childImageSharp {
              gatsbyImageData(width: 80, height: 80, placeholder: BLURRED)
            }
          }
        }
      }
      html
    }
  }
`;

export default Club;
