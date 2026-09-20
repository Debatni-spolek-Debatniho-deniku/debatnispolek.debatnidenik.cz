import React, { useEffect, useRef } from "react";
import { graphql, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
  ImageDataLike,
} from "gatsby-plugin-image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HeroData {
  badge: string;
  title: string;
  lead: string;
}

interface IntroItem {
  icon: string;
  title: string;
  text: string;
}

interface IntroData {
  badge: string;
  title: string;
  lead: string;
  items: IntroItem[];
}

interface DisclaimerData {
  title: string;
  text: string;
  kodexText: string;
  kodexLink: string;
}

interface ContactMethodItem {
  icon: string;
  title: string;
  text: string;
  buttonText?: string;
  buttonHref?: string;
}

interface ContactMethodsData {
  badge: string;
  title: string;
  lead: string;
  items: ContactMethodItem[];
}

interface TeamMember {
  name: string;
  bio: string;
  image?: IGatsbyImageData;
  discord: string;
  discordNote?: string;
  instagram: string;
  instagramNote?: string;
  instagramHref?: string;
}

interface TeamData {
  badge: string;
  title: string;
  lead: string;
  members: TeamMember[];
}

interface HelpResourceItem {
  name: string;
  note?: string;
  phone?: string;
  email?: string;
  website?: string;
  websiteLabel?: string;
}

interface HelpResourceCategory {
  title: string;
  icon: string;
  items: HelpResourceItem[];
}

interface HelpResourcesData {
  badge: string;
  title: string;
  lead: string;
  categories: HelpResourceCategory[];
}

interface ActivityItem {
  icon: string;
  title: string;
  text: string;
}

interface ActivitiesData {
  badge: string;
  title: string;
  lead: string;
  items: ActivityItem[];
}

interface EquityRoleData {
  badge: string;
  title: string;
  text: { html: string };
}

interface CtaBannerData {
  title: string;
  text: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  discordButtonText: string;
  discordHref: string;
}

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook                                                 */
/* ------------------------------------------------------------------ */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sections = el.querySelectorAll<HTMLElement>(".equity-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("equity-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function EquityPage({ data }: PageProps<any>) {
  const yml = data?.equityYaml;
  invariant(yml, "equity.yml data is required");

  /* --- Validate sections --- */
  invariant(yml.hero, "Hero data is required");
  const hero = yml.hero as HeroData;

  invariant(yml.intro, "Intro data is required");
  const intro = yml.intro as IntroData;

  invariant(yml.disclaimer, "Disclaimer data is required");
  const disclaimer = yml.disclaimer as DisclaimerData;

  invariant(yml.contactMethods, "ContactMethods data is required");
  const contactMethods = yml.contactMethods as ContactMethodsData;

  invariant(yml.team, "Team data is required");
  const teamRaw = yml.team;
  const team: TeamData = {
    badge: teamRaw.badge,
    title: teamRaw.title,
    lead: teamRaw.lead,
    members: teamRaw.members.map((m: any) => {
      const img = m.image ? getImage(m.image as ImageDataLike) : undefined;
      return {
        name: m.name,
        bio: m.bio,
        image: img || undefined,
        discord: m.discord,
        discordNote: m.discordNote,
        instagram: m.instagram,
        instagramNote: m.instagramNote,
        instagramHref: m.instagramHref,
      } as TeamMember;
    }),
  };

  invariant(yml.helpResources, "HelpResources data is required");
  const helpResources = yml.helpResources as HelpResourcesData;

  invariant(yml.activities, "Activities data is required");
  const activities = yml.activities as ActivitiesData;

  invariant(yml.equityRole, "EquityRole data is required");
  const equityRole = yml.equityRole as EquityRoleData;

  invariant(yml.ctaBanner, "CtaBanner data is required");
  const ctaBanner = yml.ctaBanner as CtaBannerData;

  const wrapperRef = useScrollReveal();

  return (
    <Layout>
      <div ref={wrapperRef}>
        {/* ============================================================ */}
        {/* HERO                                                         */}
        {/* ============================================================ */}
        <section className="pt-4 pt-lg-5 pb-3 pb-lg-4 equity-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-9 text-center">
              {hero.badge && (
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-light text-primary fw-semibold small mb-3">
                  <i className="bi bi-heart-fill"></i> {hero.badge}
                </div>
              )}
              <h1 className="display-4 fw-bold mb-3">{hero.title}</h1>
              <p
                className="lead mb-4 text-muted mx-auto"
                style={{ maxWidth: 760 }}
              >
                {hero.lead}
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap align-items-center">
                <a href="#kontakt" className="btn btn-primary btn-lg">
                  <i className="bi bi-chat-heart me-2"></i>
                  Obrať se na nás
                </a>
                <a href="#odborna-pomoc" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-telephone me-2"></i>
                  Odborná pomoc
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INTRO – CO PRO TEBE MŮŽEME UDĚLAT                           */}
        {/* ============================================================ */}
        <section className="py-5 equity-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {intro.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {intro.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{intro.title}</h2>
              <p className="lead text-muted">{intro.lead}</p>
            </div>
          </div>

          <div className="row g-4">
            {intro.items.map((item: IntroItem, index: number) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 p-4 shadow-sm border-0 transition-card">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <i className={`bi ${item.icon} fs-4`}></i>
                    </div>
                    <h5 className="card-title mb-0 fw-bold">{item.title}</h5>
                  </div>
                  <p className="card-text text-muted mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* DISCLAIMER – DŮLEŽITÉ UPOZORNĚNÍ                             */}
        {/* ============================================================ */}
        <section className="equity-reveal">
          <div className="equity-disclaimer p-4 px-lg-5 rounded shadow-sm">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-2">{disclaimer.title}</h4>
                    <p className="text-muted mb-2">{disclaimer.text}</p>
                    {disclaimer.kodexLink && (
                      <a
                        href={disclaimer.kodexLink}
                        className="fw-semibold text-primary text-decoration-none"
                      >
                        <i className="bi bi-file-earmark-text me-1"></i>
                        {disclaimer.kodexText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <a href="#odborna-pomoc" className="btn btn-outline-primary">
                  <i className="bi bi-arrow-down-circle me-2"></i>
                  Přehled odborné pomoci
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CONTACT METHODS – JAK SE NA NÁS OBRÁTIT                     */}
        {/* ============================================================ */}
        <section id="kontakt" className="py-5 equity-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {contactMethods.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {contactMethods.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">
                {contactMethods.title}
              </h2>
              <p className="lead text-muted">{contactMethods.lead}</p>
            </div>
          </div>

          <div className="row g-4">
            {contactMethods.items.map(
              (item: ContactMethodItem, index: number) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100 p-4 shadow-sm border-0 transition-card d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                          style={{ width: "48px", height: "48px" }}
                        >
                          <i className={`bi ${item.icon} fs-4`}></i>
                        </div>
                        <h5 className="card-title mb-0 fw-bold">
                          {item.title}
                        </h5>
                      </div>
                      <p className="card-text text-muted mb-0">{item.text}</p>
                    </div>
                    {item.buttonHref && (
                      <div className="pt-3 mt-auto border-top">
                        <a
                          href={item.buttonHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm w-100 fw-semibold"
                        >
                          <i className="bi bi-box-arrow-up-right me-1"></i>{" "}
                          {item.buttonText}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* TEAM – KDO ZA TEA STOJÍ                                      */}
        {/* ============================================================ */}
        <section className="py-5 equity-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {team.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {team.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{team.title}</h2>
              <p className="lead text-muted">{team.lead}</p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {team.members.map((member: TeamMember, index: number) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 p-4 shadow-sm border-0 equity-team-card">
                  <div className="d-flex align-items-center mb-3">
                    {member.image ? (
                      <GatsbyImage
                        image={member.image}
                        alt={member.name}
                        className="rounded-circle me-3 flex-shrink-0"
                        style={{ width: "52px", height: "52px" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                        style={{
                          width: "52px",
                          height: "52px",
                          fontSize: "1.4rem",
                          fontWeight: 700,
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <h5 className="fw-bold mb-0">{member.name}</h5>
                  </div>

                  <p className="text-muted small mb-3">{member.bio}</p>

                  <div className="mt-auto pt-3 border-top">
                    <div className="d-flex flex-column gap-1">
                      <div className="small">
                        <i className="bi bi-discord text-primary me-2"></i>
                        <strong>{member.discord}</strong>
                        {member.discordNote && (
                          <span className="text-muted ms-1">
                            ({member.discordNote})
                          </span>
                        )}
                      </div>
                      <div className="small">
                        <i className="bi bi-instagram text-primary me-2"></i>
                        {member.instagramHref ? (
                          <a
                            href={member.instagramHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fw-semibold text-decoration-none"
                          >
                            {member.instagram}
                          </a>
                        ) : (
                          <strong>{member.instagram}</strong>
                        )}
                        {member.instagramNote && (
                          <span className="text-muted ms-1">
                            ({member.instagramNote})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* EQUITY ROLE – CO DĚLÁ EQUITY NA TURNAJI                      */}
        {/* ============================================================ */}
        <section className="py-5 px-4 rounded bg-primary-light my-5 shadow-sm equity-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              {equityRole.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {equityRole.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{equityRole.title}</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="equity-role-body"
                dangerouslySetInnerHTML={{ __html: equityRole.text.html }}
              ></div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ACTIVITIES – NAŠE AKTIVITY                                    */}
        {/* ============================================================ */}
        <section className="py-5 equity-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {activities.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {activities.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{activities.title}</h2>
              <p className="lead text-muted">{activities.lead}</p>
            </div>
          </div>

          <div className="row g-4">
            {activities.items.map((item: ActivityItem, index: number) => (
              <div key={index} className="col-md-6">
                <div className="card h-100 p-4 shadow-sm border-0 transition-card">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <i className={`bi ${item.icon} fs-4`}></i>
                    </div>
                    <h5 className="card-title mb-0 fw-bold">{item.title}</h5>
                  </div>
                  <p className="card-text text-muted mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* HELP RESOURCES – ODBORNÁ POMOC                               */}
        {/* ============================================================ */}
        <section id="odborna-pomoc" className="py-5 equity-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {helpResources.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {helpResources.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">
                {helpResources.title}
              </h2>
              <p className="lead text-muted">{helpResources.lead}</p>
            </div>
          </div>

          {helpResources.categories.map(
            (category: HelpResourceCategory, catIndex: number) => (
              <div key={catIndex} className="mb-5">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className={`bi ${category.icon} fs-5`}></i>
                  </div>
                  <h4 className="fw-bold mb-0">{category.title}</h4>
                </div>
                <div className="row g-3">
                  {category.items.map(
                    (item: HelpResourceItem, itemIndex: number) => (
                      <div
                        key={itemIndex}
                        className="col-sm-6 col-lg-4"
                      >
                        <div className="equity-help-card h-100">
                          <h6 className="fw-bold mb-1">
                            {item.name}
                            {item.note && (
                              <span className="text-muted fw-normal ms-1 small">
                                ({item.note})
                              </span>
                            )}
                          </h6>
                          <div className="d-flex flex-column gap-1 mt-2">
                            {item.phone && (
                              <div className="small">
                                <i className="bi bi-telephone text-primary me-2"></i>
                                <a
                                  href={`tel:${item.phone.replace(/\s/g, "")}`}
                                  className="fw-semibold text-decoration-none"
                                >
                                  {item.phone}
                                </a>
                              </div>
                            )}
                            {item.email && (
                              <div className="small">
                                <i className="bi bi-envelope text-primary me-2"></i>
                                <a
                                  href={`mailto:${item.email}`}
                                  className="text-decoration-none"
                                >
                                  {item.email}
                                </a>
                              </div>
                            )}
                            {item.website && (
                              <div className="small">
                                <i className="bi bi-globe text-primary me-2"></i>
                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="fw-semibold text-decoration-none"
                                >
                                  {item.websiteLabel || item.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </section>

        {/* ============================================================ */}
        {/* CTA BANNER                                                    */}
        {/* ============================================================ */}
        <section className="py-5 px-4 rounded bg-primary-light my-5 shadow-sm text-center equity-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">{ctaBanner.title}</h2>
              <p className="lead mb-4 text-muted">{ctaBanner.text}</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                {ctaBanner.primaryButtonHref && (
                  <a
                    href={ctaBanner.primaryButtonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    {ctaBanner.primaryButtonText}
                  </a>
                )}
                {ctaBanner.discordHref && (
                  <a
                    href={ctaBanner.discordHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-discord me-2"></i>
                    {ctaBanner.discordButtonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const Head = () => (
  <SEO
    title="Equity – Tým pro Empatii a Asistenci"
    description="Tým pro Empatii a Asistenci (TEA) Debatního spolku Debatního deníku. Nabízíme bezpečný prostor pro rozhovor, pomoc s problémy a kontakty na odbornou pomoc."
    pathname="/equity"
  />
);

export const query = graphql`
  query EquityPage {
    equityYaml {
      hero {
        badge
        title
        lead
      }
      intro {
        badge
        title
        lead
        items {
          icon
          title
          text
        }
      }
      disclaimer {
        title
        text
        kodexText
        kodexLink
      }
      contactMethods {
        badge
        title
        lead
        items {
          icon
          title
          text
          buttonText
          buttonHref
        }
      }
      team {
        badge
        title
        lead
        members {
          name
          bio
          discord
          discordNote
          instagram
          instagramNote
          instagramHref
          image {
            childImageSharp {
              gatsbyImageData(width: 120, height: 120, placeholder: BLURRED)
            }
          }
        }
      }
      helpResources {
        badge
        title
        lead
        categories {
          title
          icon
          items {
            name
            note
            phone
            email
            website
            websiteLabel
          }
        }
      }
      activities {
        badge
        title
        lead
        items {
          icon
          title
          text
        }
      }
      equityRole {
        badge
        title
        text {
          html
        }
      }
      ctaBanner {
        title
        text
        primaryButtonText
        primaryButtonHref
        discordButtonText
        discordHref
      }
    }
  }
`;
