import React, { PropsWithChildren } from "react";
import SignUpModal from "./SignUpModal";
import NavItems from "./NavItems";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container">
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src="/NavLogo.svg" alt="Debatní spolek" height="64" />
            </a>
            <SignUpModal buttonClassName="btn btn-primary order-lg-last ms-lg-3" />
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

      <main>{children}</main>

      <footer className="py-3 mt-4 border-top">
        <p className="text-center text-muted">
          © {new Date().getFullYear()} Debatní spolek Debatního deníku
        </p>
      </footer>
    </div>
  );
};

export default Layout;
