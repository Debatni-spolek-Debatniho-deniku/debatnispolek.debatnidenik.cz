import * as React from "react";
import { useEffect, useRef } from "react";
import { graphql, PageProps } from "gatsby";
import { assert } from "../helpers";
import Layout from "../components/Layout";
import type { AuthenticationType } from "azure-maps-control";
import type atlas from "azure-maps-control";

const Generic = (props: PageProps<Queries.GenericPageQuery>) => {
  const page = props.data.markdownRemark;
  const mapRef = useRef<atlas.Map | null>(null);

  // Byl to typecheck error
  assert(page?.frontmatter, "Front matter is not set.");
  assert(page?.html, "Html is not set.");

  const lat = page.frontmatter.lat;
  const lon = page.frontmatter.lon;

  // Byl to typecheck error
  assert(lat, "Lat not set.");
  assert(lon, "Lat not set.");

  // Byl to typecheck error
  assert(page.frontmatter.owner, "Owner not set");

  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    (async () => {
      const atlas = await import("azure-maps-control");

      const map = new atlas.Map("map", {
        center: [lon, lat],
        zoom: 15,
        language: "en-US",
        showFeedbackLink: false,
        showLogo: false,
        enableAccessibility: false,
        authOptions: {
          authType: "subscriptionKey" as AuthenticationType,
          subscriptionKey:
            "61zGn9NwDmytXArWxCihG8wLV38pnagNC5XzekdUqUWo70eUdqE6JQQJ99BLAC5RqLJ3Wae9AAAgAZMP2Bye",
        },
      });

      mapRef.current = map;

      map.events.add("ready", () => {
        console.log("Map is ready");
        const datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        const symbolLayer = new atlas.layer.SymbolLayer(
          datasource,
          "symbol-layer"
        );
        map.layers.add(symbolLayer);

        const point = new atlas.data.Feature(new atlas.data.Point([lon, lat]));
        datasource.add(point);
      });

      map.events.add("error", (e) => {
        console.error("Map error occurred:", e);
      });
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.dispose();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 offset-1 pt-5">
            {page.frontmatter?.title && <h1>{page.frontmatter.title}</h1>}
            <main dangerouslySetInnerHTML={{ __html: page.html }} />
          </div>
          <div className="col-4 bg-light-blue pt-5">
            <div className="row flex-column">
              <h3 className="pt-3 pb-3">Informace o klubu</h3>
              {page.frontmatter?.info && (
                <h5>
                  {page.frontmatter.info.map((informace, index) => (
                    <span key={index}>{informace}</span>
                  ))}
                </h5>
              )}
              <div
                id="map"
                className="col-12 pb-5"
                style={{ height: "200px", overflow: "hidden" }}
              ></div>
              <div className="col-12">
                <h3 className="mt-5">Odpovědná osoba</h3>
                <div className="row">
                  {page.frontmatter.owner.map((person, index) => {
                    assert(person, "person is not set");

                    return (
                      <div key={index} className="col-6">
                        <div
                          className="card mb-3 border-0 pt-3"
                          style={{ backgroundColor: "transparent" }}
                        >
                          <img
                            src={
                              person.image ||
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfallQFU-QIL1eceAPBD99gmKLPTox8C5a3g&s"
                            }
                            className="rounded-circle mx-auto d-block mt-3"
                            alt={person.name || "..."}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="card-body text-center p-2">
                            <h5 className="mb-1">{person.name}</h5>
                            <p className="mb-0 text-muted small">
                              Email: {person.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query GenericPage($markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      frontmatter {
        title
        lat
        lon
        info
        owner {
          name
          email
          image
        }
      }
      html
    }
  }
`;

export default Generic;
