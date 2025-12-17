import { graphql, PageProps } from "gatsby";
import React from "react";
import { assert } from "../helpers";

const klubiky = ["Praha", "Brno", "Ostrava", "Plzeň", "Liberec"];

const Home: React.FC<PageProps<Queries.IndexPageQuery>> = (props) => {
  assert(props?.data?.allSitePage?.nodes, "Nodes not set!");

  console.log(props?.data?.allSitePage?.nodes);

  return (
    <>
      <header
        id="header"
        className="header d-flex align-items-center sticky-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a
            href="index.html"
            className="logo d-flex align-items-center me-auto"
          >
            <h1 className="sitename">Learner</h1>
          </a>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="index.html" className="active">
                  Home
                </a>
              </li>
              <li>
                <a href="about.html">About</a>
              </li>
              <li>
                <a href="courses.html">Courses</a>
              </li>
              <li>
                <a href="instructors.html">Instructors</a>
              </li>
              <li>
                <a href="pricing.html">Pricing</a>
              </li>
              <li>
                <a href="blog.html">Blog</a>
              </li>
              <li className="dropdown">
                <a href="#">
                  <span>Klubikyyyyyyy</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  {klubiky.map((klub, index) => (
                    <li key={index}>
                      <a href="#">{klub}</a>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="dropdown">
                <a href="#">
                  <span>Dropdown</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="#">Dropdown 1</a>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      <span>Deep Dropdown</span>{" "}
                      <i className="bi bi-chevron-down toggle-dropdown"></i>
                    </a>
                    <ul>
                      <li>
                        <a href="#">Deep Dropdown 1</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 2</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 3</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 4</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 5</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">Dropdown 2</a>
                  </li>
                  <li>
                    <a href="#">Dropdown 3</a>
                  </li>
                  <li>
                    <a href="#">Dropdown 4</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="contact.html">Contact</a>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <a className="btn-getstarted" href="enroll.html">
            Enroll Now
          </a>
        </div>
      </header>
      <div className="container-luid">
        <div className="row pt-5 pb-5 bg-light-blue">
          <div className="col-10 offset-1 row">
            <div className="offset-1 col-3 mt-5">
              <div className="row">
                <h1>Nadpis nějakej velvo #FREESOCHOR</h1>
              </div>
              <div className="row col-12">
                <p className="col-12">
                  We are Charlie Kirk, we carry the flame We’ll fight for the
                  Gospel, we’ll honor his name We are Charlie Kirk, his courage
                  our own Together unbroken, we’ll make Heaven known A husband,
                  a father, his family held near A home built on Scripture, on
                  faith without fear The world tried to silence, but his voice
                  remains In us it echoes, in Christ it sustains
                </p>
              </div>
              <div className="row mt-5 col-12">
                <div className="col-2">
                  <button type="button" className="btn btn-primary btn-lg">
                    Primary
                  </button>
                </div>
                <div className="col-2 offset-2">
                  <button type="button" className="btn btn-primary btn-lg">
                    Primary
                  </button>
                </div>
                <div className="col-2 offset-2">
                  <button type="button" className="btn btn-primary btn-lg">
                    Primary
                  </button>
                </div>
              </div>
            </div>
            <div className="col-6 offset-2 mt-5">
              <img
                className="img-fluid"
                src="https://d8-a.sdn.cz/d_8/c_imgrestricted_od_A/nO2tpF5hUICLbyDwFET256W/c727/charlie-kirk.jpeg?fl=cro,0,532,2453,1379%7Cres,1200,,1"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="row pt-5 pb-5 bg-dark-blue">
          <div className="col-10 offset-1 row">
            <div className="offset-1 col-3 mt-5">
              <div className="row">
                <h2>O Charliem</h2>
              </div>
            </div>
            <div className="col-11 offset-1 mt-3">
              <p>
                Charles James Kirk (October 14, 1993 – September 10, 2025) was
                an American right-wing political activist, entrepreneur, and
                media personality. He co‑founded the conservative student
                organization Turning Point USA (TPUSA) in 2012 and served as its
                executive director until his assassination in 2025. A key ally
                of Donald Trump, he became one of the most prominent voices of
                the MAGA movement within the Republican Party, publishing
                several books and hosting The Charlie Kirk Show. Born and raised
                in the Chicago suburbs of Arlington Heights and Prospect
                Heights, Kirk became politically active in high school. He
              </p>
            </div>
          </div>
        </div>
        <div className="row pt-5 pb-5 bg-light-blue">
          <div className="col-10 offset-1 row">
            <div className="offset-1 col-12 mt-5">
              <div className="row">
                <h2>Proč debatovat</h2>
              </div>
              <div className="row justify-content-evenly">
                <div className="col-3 mt-5">
                  <div className="card">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfallQFU-QIL1eceAPBD99gmKLPTox8C5a3g&s"
                      className="card-img-top"
                      alt="..."
                    ></img>
                    <div className="card-body">
                      <p className="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mt-5">
                  <div className="card">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfallQFU-QIL1eceAPBD99gmKLPTox8C5a3g&s"
                      className="card-img-top"
                      alt="..."
                    ></img>
                    <div className="card-body">
                      <p className="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-3 mt-5">
                  <div className="card">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfallQFU-QIL1eceAPBD99gmKLPTox8C5a3g&s"
                      className="card-img-top"
                      alt="..."
                    ></img>
                    <div className="card-body">
                      <p className="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-5 pb-5 bg-dark-blue">
          <div className="col-10 offset-1 row">
            <div className="offset-1 col-3 mt-5">
              <div className="row">
                <h2>O spolku</h2>
              </div>
            </div>
            <div className="col-11 offset-1 mt-3">
              <p>
                Charles James Kirk (October 14, 1993 – September 10, 2025) was
                an American right-wing political activist, entrepreneur, and
                media personality. He co‑founded the conservative student
                organization Turning Point USA (TPUSA) in 2012 and served as its
                executive director until his assassination in 2025. A key ally
                of Donald Trump, he became one of the most prominent voices of
                the MAGA movement within the Republican Party, publishing
                several books and hosting The Charlie Kirk Show. Born and raised
                in the Chicago suburbs of Arlington Heights and Prospect
                Heights, Kirk became politically active in high school. He
              </p>
            </div>
          </div>
        </div>
        <div className="row pt-5 pb-5 bg-light-blue">
          <div className="col-10 offset-1 row">
            <div className="offset-1 col-3 mt-5">
              <div className="row">
                <h2>O dkazy</h2>
              </div>
            </div>
            <div className="col-11 offset-1 mt-3">
              <div className="row">
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    Stanování
                  </button>
                </div>
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    Mrdky krtky
                  </button>
                </div>
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    #FREESOCHOR
                  </button>
                </div>
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    #FREESOCHOR
                  </button>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    #FREESOCHOR
                  </button>
                </div>{" "}
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    #FREESOCHOR
                  </button>
                </div>{" "}
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    #FREESOCHOR
                  </button>
                </div>{" "}
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-lg col-12"
                  >
                    #FREESOCHOR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </>
  );
};

export const query = graphql`
  query IndexPage {
    allSitePage {
      nodes {
        path
        id
        pageContext
      }
    }
  }
`;

export default Home;
