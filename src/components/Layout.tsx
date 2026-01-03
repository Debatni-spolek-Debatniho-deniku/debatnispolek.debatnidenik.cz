import React, { PropsWithChildren } from "react";
import ErrorBoundary from "./ErrorBoundary";
import ClubPicker from "./ClubPicker";
import NavItems from "./NavItems";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-vh-100 d-flex flex-column">
        <header>
          <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
            <div className="container">
              <a className="navbar-brand" href="/">
                <img
                  src="/NavLogo_compact.svg"
                  alt="Debatní spolek"
                  height="64"
                  className="d-sm-none"
                />
                <img
                  src="/NavLogo_full.svg"
                  alt="Debatní spolek"
                  height="64"
                  className="d-none d-sm-block"
                />
              </a>
              <ClubPicker buttonClassName="order-lg-last py-2 py-lg-1 ms-auto me-4 me-lg-0 ms-lg-5" />
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <NavItems />
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow-1">
          <div className="container my-4">{children}</div>
        </main>

        <footer className="py-3 border-top w-100">
          <div className="container">
            <p className="text-center text-muted">
              © {new Date().getFullYear()} Debatní spolek Debatního deníku
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
