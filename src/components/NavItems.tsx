import React from "react";
import { graphql, useStaticQuery } from "gatsby";

const NavItems: React.FC = () => {
  const data = useStaticQuery<Queries.NavQueryQuery>(graphql`
    query NavQuery {
      allNavYaml {
        nodes {
          label
          path
          items {
            label
            path
          }
        }
      }
    }
  `);

  const navItems = data.allNavYaml.nodes;

  return (
    <ul className="navbar-nav ms-auto">
      {navItems.map((item, index) =>
        item.items ? (
          <li className="nav-item dropdown" key={index}>
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {item.label}
            </a>
            <ul className="dropdown-menu">
              {item.items.map((child, childIndex) => (
                <li key={childIndex}>
                  <a className="dropdown-item" href={child?.path ?? "#"}>
                    {child?.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li className="nav-item" key={index}>
            <a className="nav-link" href={item.path ?? "#"}>
              {item.label}
            </a>
          </li>
        )
      )}
    </ul>
  );
};

export default NavItems;
