import React, { FC, PropsWithChildren } from "react";
import { graphql, useStaticQuery } from "gatsby";
import invariant from "tiny-invariant";
import SmartAnchor from "./SmartAnchor";

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
  invariant(navItems, "navItems are required");

  return (
    <ul className="navbar-nav ms-auto">
      {navItems.map((item, index) => {
        invariant(item, "nav item is required");
        invariant(item.label, "nav item label is required");
        // item.path is not required if item.items exists

        const Li: FC<PropsWithChildren> = ({ children }) => (
          <li className="nav-item px-lg-2 dropdown" key={index}>
            {children}
          </li>
        );

        if (item.items) {
          invariant(Array.isArray(item.items), "nav item.items must be array");
          return (
            <Li>
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
                {item.items.map((child) => {
                  invariant(child.label, "nav child label is required");
                  invariant(child.path, "nav child path is required");
                  return (
                    <li key={child.label}>
                      <SmartAnchor className="dropdown-item" href={child.path}>
                        {child.label}
                      </SmartAnchor>
                    </li>
                  );
                })}
              </ul>
            </Li>
          );
        } else {
          invariant(item.path, "nav item path is required");
          return (
            <Li>
              <SmartAnchor className="nav-link" href={item.path}>
                {item.label}
              </SmartAnchor>
            </Li>
          );
        }
      })}
    </ul>
  );
};

export default NavItems;
