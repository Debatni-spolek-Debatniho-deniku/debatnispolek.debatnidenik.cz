import React from "react";
import navData from "../pages/nav.json";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        id="header"
        className="header d-flex align-items-center sticky-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a href="/" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">Learner</h1>
          </a>

          <nav id="navmenu" className="navmenu">
            <ul>
              {navData.navItems.map((item, index) => {
                const key = Object.keys(item)[0];
                const value = item[key as keyof typeof item];

                if (Array.isArray(value)) {
                  return (
                    <li key={index} className="dropdown">
                      <a href="#">
                        <span>{key}</span>{" "}
                        <i className="bi bi-chevron-down toggle-dropdown"></i>
                      </a>
                      <ul>
                        {value.map((child, childIndex) => {
                          const childKey = Object.keys(child)[0];
                          const childUrl =
                            child[childKey as keyof typeof child];
                          return (
                            <li key={childIndex}>
                              <a href={childUrl}>{childKey}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                } else {
                  return (
                    <li key={index}>
                      <a href={value}>{key}</a>
                    </li>
                  );
                }
              })}
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <a className="btn-getstarted" href="enroll.html">
            Enroll Now
          </a>
        </div>
      </header>

      <div style={{ flex: 1 }}>{children}</div>

      <footer className="bg-dark-blue text-secondary  py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Contact Us</h5>
              <p>Email: info@debatnispolek.cz</p>
              <p>Phone: +420 123 456 789</p>
            </div>
            <div className="col-md-4">
              <h5>Address</h5>
              <p>Prague, Czech Republic</p>
            </div>
            <div className="col-md-4">
              <h5>Follow Us</h5>
              <p>Facebook: @debatnispolek</p>
              <p>Twitter: @debatnidenik</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
