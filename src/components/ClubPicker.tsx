import React, { useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import invariant from "tiny-invariant";
import SmartAnchor from "./SmartAnchor";

const CardButton: React.FC<{
  imageSrc: string;
  title: string;
  href: string;
}> = ({ imageSrc, title, href }) => {
  return (
    <SmartAnchor
      href={href}
      className="btn btn-outline-primary d-flex align-items-center mb-2 text-start"
      style={{ textDecoration: "none" }}
    >
      <div className="signup-modal-image-container">
        <img src={imageSrc} alt={title} className="signup-modal-image" />
      </div>

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
    | undefined,
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
      "interval months are required",
    );

    return (
      currentMonth >= interval.fromMonth && currentMonth <= interval.toMonth
    );
  });
};

const ClubPicker: React.FC<{
  buttonClassName?: string;
  buttonVariant?: "sm" | "lg";
}> = ({ buttonClassName, buttonVariant = "sm" }) => {
  const [show, setShow] = useState(false);

  const data = useStaticQuery<Queries.AvailableClubsQueryQuery>(graphql`
    query AvailableClubsQuery {
      allClubpickerAvailableclubsYaml {
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

  const clubs = data.allClubpickerAvailableclubsYaml.nodes;
  invariant(clubs, "clubs are required");

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`btn btn-${buttonVariant} btn-secondary${
          buttonClassName ? " " + buttonClassName : ""
        }`}
        onClick={() => setShow(true)}
      >
        Přihlaš se na debatu
      </button>

      {show && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex={-1}
            aria-labelledby="clubPickerLabel"
            aria-hidden={false}
            onClick={handleBackdropClick}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="clubPickerLabel">
                    Vyber si debatní klub
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
                    {clubs
                      .filter((club) => {
                        if (!club.availability) return true;

                        return isAvailable(club.availability);
                      })
                      .map((club) => {
                        invariant(club.label, "club label is required");
                        invariant(club.form, "club form is required");
                        invariant(
                          club.image?.publicURL,
                          "club image is required",
                        );

                        return (
                          <CardButton
                            key={club.label}
                            imageSrc={club.image.publicURL}
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

export default ClubPicker;
