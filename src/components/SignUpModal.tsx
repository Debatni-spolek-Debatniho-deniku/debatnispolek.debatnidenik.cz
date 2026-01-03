import React, { useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import invariant from "tiny-invariant";
import SmartAnchor from "./SmartAnchor";

const CardButton: React.FC<{
  imageSrc?: string | null;
  title: string;
  href: string;
}> = ({ imageSrc, title, href }) => {
  return (
    <SmartAnchor
      href={href}
      className="btn btn-outline-secondary d-flex align-items-center mb-2 text-start"
      style={{ textDecoration: "none" }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="rounded-start"
          style={{
            maxWidth: 64,
            maxHeight: 48,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      )}
      {!imageSrc && <div style={{ width: 64, height: 48 }}></div>}
      <div className="ms-4 flex-grow-1">
        <h6 className="mb-0">{title}</h6>
      </div>
    </SmartAnchor>
  );
};

const isAvailable = (
  availability:
    | ReadonlyArray<{
        fromMonth: number | null;
        toMonth: number | null;
      } | null>
    | null
    | undefined
): boolean => {
  // If no availability specified, always available
  if (!availability || availability.length === 0) {
    return true;
  }

  const currentMonth = new Date().getMonth() + 1; // 1-12

  return availability.some((interval) => {
    if (!interval) return false;

    invariant(
      interval.fromMonth !== null && interval.toMonth !== null,
      "interval months are required"
    );

    return (
      currentMonth >= interval.fromMonth && currentMonth <= interval.toMonth
    );
  });
};

const SignUpModal: React.FC<{
  buttonClassName?: string;
}> = ({ buttonClassName }) => {
  const [show, setShow] = useState(false);

  const data = useStaticQuery<Queries.AvailableClubsQueryQuery>(graphql`
    query AvailableClubsQuery {
      allAvailableClubsYaml {
        nodes {
          label
          image {
            publicURL
          }
          form
          availability {
            fromMonth
            toMonth
          }
        }
      }
    }
  `);

  const clubs = data.allAvailableClubsYaml.nodes;
  invariant(clubs, "clubs are required");

  const availableClubs = clubs.filter((club, originalIndex) => {
    if (!club.availability) return true;

    return isAvailable(club.availability);
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`btn btn-sm btn-primary ${
          buttonClassName ? " " + buttonClassName : ""
        }`}
        onClick={() => setShow(true)}
      >
        Přihlásit se na debatu
      </button>

      {show && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex={-1}
            aria-labelledby="signUpModalLabel"
            aria-hidden={false}
            onClick={handleBackdropClick}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="signUpModalLabel">
                    Přihlásit se na debatu
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShow(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="list-group">
                    {availableClubs.map((club) => {
                      invariant(club.label, "club label is required");
                      invariant(club.form, "club form is required");

                      return (
                        <CardButton
                          key={club.label}
                          imageSrc={club.image?.publicURL}
                          title={club.label}
                          href={club.form}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShow(false)}
          />
        </>
      )}
    </>
  );
};

export default SignUpModal;
