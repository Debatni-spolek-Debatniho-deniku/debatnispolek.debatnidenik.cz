import React, { useState } from "react";

interface SignUpModalProps {
  buttonClassName?: string;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ buttonClassName }) => {
  const [show, setShow] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={buttonClassName ?? "btn btn-primary"}
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
                  <p>Obsah přihlašovacího formuláře.</p>
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
