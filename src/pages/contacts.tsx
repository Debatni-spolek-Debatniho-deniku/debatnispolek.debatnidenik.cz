import React, { useEffect, useRef } from "react";
import { graphql, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ClubPicker from "../components/ClubPicker";
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

interface ContactInfoData {
  phone: string;
  email: string;
  discord: string;
  address: string;
}

interface IdentificationData {
  name: string;
  address: string;
  ico: string;
  vatNote: string;
}

interface CommitteeMember {
  name: string;
  role: string;
  region?: string;
  bio: string;
  email: string;
  discord: string;
  phone?: string;
  image: IGatsbyImageData;
}

interface CommissionMember {
  name: string;
  role: string;
  discord: string;
  email: string;
  image: IGatsbyImageData;
}

interface Commission {
  name: string;
  description: string;
  icon: string;
  formLink?: string;
  pageLink?: string;
  pageLinkText?: string;
  members: CommissionMember[];
}

interface CtaBannerData {
  title: string;
  text: string;
  discordText: string;
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

    const sections = el.querySelectorAll<HTMLElement>(".contact-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("contact-reveal--visible");
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactsPage({
  data,
}: PageProps<Queries.ContactsPageQuery>) {
  const yml = data.contactsYaml;
  invariant(yml, "contacts.yml data is required");

  /* --- Hero --- */
  invariant(yml.hero, "Hero data is required");
  const hero = yml.hero as HeroData;

  /* --- Contact info --- */
  invariant(yml.contactInfo, "Contact info is required");
  const contactInfo = yml.contactInfo as ContactInfoData;

  /* --- Identification --- */
  invariant(yml.identification, "Identification data is required");
  const identification = yml.identification as IdentificationData;

  /* --- Committee intro --- */
  const committeeIntro = yml.committeeIntro as string;

  /* --- Committee --- */
  invariant(yml.committee, "Committee data is required");
  const committee: CommitteeMember[] = yml.committee.map((m) => {
    invariant(m, "Committee member is required");
    const image = getImage(m.image as ImageDataLike);
    invariant(image, "Committee member image is required");
    invariant(m.name, "Committee member name is required");
    invariant(m.role, "Committee member role is required");
    invariant(m.bio, "Committee member bio is required");
    invariant(m.email, "Committee member email is required");
    invariant(m.discord, "Committee member discord is required");
    return {
      name: m.name,
      role: m.role,
      region: m.region ?? undefined,
      bio: m.bio,
      email: m.email,
      discord: m.discord,
      phone: m.phone ?? undefined,
      image,
    };
  });

  /* --- Commissions --- */
  invariant(yml.commissions, "Commissions data is required");
  const commissions: Commission[] = yml.commissions.map((c) => {
    invariant(c, "Commission is required");
    invariant(c.name, "Commission name is required");
    invariant(c.description, "Commission description is required");
    invariant(c.icon, "Commission icon is required");
    invariant(c.members, "Commission members are required");
    return {
      name: c.name,
      description: c.description,
      icon: c.icon,
      formLink: c.formLink ?? undefined,
      pageLink: c.pageLink ?? undefined,
      pageLinkText: c.pageLinkText ?? undefined,
      members: c.members.map((m) => {
        invariant(m, "Commission member is required");
        const image = getImage(m.image as ImageDataLike);
        invariant(image, "Commission member image is required");
        invariant(m.name, "Name is required");
        invariant(m.role, "Role is required");
        invariant(m.discord, "Discord is required");
        invariant(m.email, "Email is required");
        return {
          name: m.name,
          role: m.role,
          discord: m.discord,
          email: m.email,
          image,
        };
      }),
    };
  });

  /* --- CTA --- */
  invariant(yml.ctaBanner, "CTA banner data is required");
  const ctaBanner = yml.ctaBanner as CtaBannerData;

  const wrapperRef = useScrollReveal();

  return (
    <Layout>
      <div ref={wrapperRef}>
        {/* ============================================================ */}
        {/* HERO                                                         */}
        {/* ============================================================ */}
        <section className="pt-4 pt-lg-5 pb-3 pb-lg-4 contact-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              {hero.badge && (
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-light text-primary fw-semibold small mb-3">
                  <i className="bi bi-people-fill"></i> {hero.badge}
                </div>
              )}
              <h1 className="display-4 fw-bold mb-3">{hero.title}</h1>
              <p className="lead mb-4 text-muted">{hero.lead}</p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CONTACT INFO CARDS                                           */}
        {/* ============================================================ */}
        <section className="py-4 contact-reveal">
          <div className="row g-4">
            {/* Phone */}
            <div className="col-md-6 col-lg-4">
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                className="card h-100 p-4 shadow-sm border-0 transition-card text-center text-decoration-none contact-info-card"
              >
                <div className="contact-info-icon mx-auto mb-3">
                  <i className="bi bi-telephone-fill fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2 text-body">Telefon</h5>
                <span className="text-muted">{contactInfo.phone}</span>
              </a>
            </div>
            {/* Email */}
            <div className="col-md-6 col-lg-4">
              <a
                href={`mailto:${contactInfo.email}`}
                className="card h-100 p-4 shadow-sm border-0 transition-card text-center text-decoration-none contact-info-card"
              >
                <div className="contact-info-icon mx-auto mb-3">
                  <i className="bi bi-envelope-fill fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2 text-body">E-mail</h5>
                <span className="text-muted">{contactInfo.email}</span>
              </a>
            </div>
            {/* Discord */}
            <div className="col-md-6 col-lg-4">
              <a
                href={contactInfo.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="card h-100 p-4 shadow-sm border-0 transition-card text-center text-decoration-none contact-info-card"
              >
                <div className="contact-info-icon mx-auto mb-3">
                  <i className="bi bi-discord fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2 text-body">Discord</h5>
                <span className="text-muted">Připojte se na Discord</span>
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* IDENTIFICATION                                               */}
        {/* ============================================================ */}
        <section className="py-4 px-4 rounded bg-primary-light my-4 contact-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="h4 fw-bold mb-3 text-center">
                <i className="bi bi-building me-2"></i>
                Identifikační údaje spolku
              </h2>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-tag text-primary mt-1"></i>
                    <div>
                      <small className="text-muted d-block">Název</small>
                      <span className="fw-semibold">{identification.name}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-geo-alt text-primary mt-1"></i>
                    <div>
                      <small className="text-muted d-block">Sídlo</small>
                      <span className="fw-semibold">
                        {identification.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-hash text-primary mt-1"></i>
                    <div>
                      <small className="text-muted d-block">IČO</small>
                      <span className="fw-semibold">{identification.ico}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-receipt text-primary mt-1"></i>
                    <div>
                      <small className="text-muted d-block">DPH</small>
                      <span className="fw-semibold">
                        {identification.vatNote}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* COMMITTEE (DEBATNÍ VÝBOR)                                    */}
        {/* ============================================================ */}
        <section className="py-5 contact-reveal">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                Statutární orgán
              </span>
              <h2 className="display-5 fw-bold mb-3">Debatní výbor</h2>
              <p className="lead text-muted">{committeeIntro}</p>
              <p className="text-muted">
                Nevíte koho kontaktovat? Napište na{" "}
                <a href={`mailto:${contactInfo.email}`}>
                  {contactInfo.email}
                </a>
              </p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {committee.map((member, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 contact-member-card">
                  <div className="card-body p-4 text-center">
                    <GatsbyImage
                      image={member.image}
                      alt={member.name}
                      className="rounded-circle contact-member-photo mx-auto mb-3"
                    />
                    <h4 className="fw-bold mb-1">{member.name}</h4>
                    <div className="text-primary fw-semibold small mb-1">
                      {member.role}
                    </div>
                    {member.region && (
                      <div className="text-muted small mb-2">
                        <i className="bi bi-geo-alt me-1"></i>
                        {member.region}
                      </div>
                    )}
                    <p className="text-muted small mb-3">{member.bio}</p>
                    <div className="border-top pt-3">
                      <div className="d-flex flex-column gap-2 align-items-center">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-decoration-none small"
                        >
                          <i className="bi bi-envelope me-1 text-primary"></i>
                          {member.email}
                        </a>
                        <span className="text-muted small">
                          <i className="bi bi-discord me-1 text-primary"></i>
                          {member.discord}
                        </span>
                        {member.phone && (
                          <a
                            href={`tel:${member.phone.replace(/\s/g, "")}`}
                            className="text-decoration-none small"
                          >
                            <i className="bi bi-telephone me-1 text-primary"></i>
                            {member.phone}
                          </a>
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
        {/* COMMISSIONS (DALŠÍ ORGÁNY)                                   */}
        {/* ============================================================ */}
        <section className="py-5 contact-reveal">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                Komise
              </span>
              <h2 className="display-5 fw-bold mb-3">Další orgány spolku</h2>
              <p className="lead text-muted">
                Debatním komisím v rámci spolku přísluší různé oblasti působení.
              </p>
            </div>
          </div>
          {commissions.map((commission, cIndex) => (
            <div key={cIndex} className="mb-5 contact-reveal">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "44px", height: "44px" }}
                >
                  <i className={`bi ${commission.icon} fs-5`}></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{commission.name}</h3>
                </div>
              </div>
              <p className="text-muted mb-3">{commission.description}</p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {commission.formLink && (
                  <a
                    href={commission.formLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Kontaktovat přes formulář
                  </a>
                )}
                {commission.pageLink && (
                  <a
                    href={commission.pageLink}
                    className="btn btn-sm btn-primary"
                  >
                    <i className="bi bi-heart me-1"></i>
                    {commission.pageLinkText || "Zjistit více"}
                  </a>
                )}
              </div>
              <div className="row g-3">
                {commission.members.map((member, mIndex) => (
                  <div key={mIndex} className="col-md-6 col-lg-4">
                    <div className="card h-100 p-3 shadow-sm border-0">
                      <div className="d-flex align-items-center gap-3">
                        <GatsbyImage
                          image={member.image}
                          alt={member.name}
                          className="rounded-circle contact-commission-photo flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h6 className="fw-bold mb-0">{member.name}</h6>
                          <div className="text-primary small fw-semibold">
                            {member.role}
                          </div>
                          <div className="mt-1">
                            <a
                              href={`mailto:${member.email}`}
                              className="text-muted text-decoration-none small d-block text-truncate"
                            >
                              <i className="bi bi-envelope me-1"></i>
                              {member.email}
                            </a>
                            <span className="text-muted small">
                              <i className="bi bi-discord me-1"></i>
                              {member.discord}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ============================================================ */}
        {/* CTA BANNER                                                   */}
        {/* ============================================================ */}
        <section className="py-5 px-4 rounded bg-primary-light my-5 shadow-sm text-center contact-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">{ctaBanner.title}</h2>
              <p className="lead mb-4 text-muted">{ctaBanner.text}</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <ClubPicker buttonVariant="lg" />
                {ctaBanner.discordHref && (
                  <a
                    href={ctaBanner.discordHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-discord me-2"></i>
                    {ctaBanner.discordText}
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
    title="Kontakty"
    description="Kontaktní informace Debatního spolku Debatního deníku. Debatní výbor, komise a kontaktní údaje."
    pathname="/contacts"
  />
);

export const query = graphql`
  query ContactsPage {
    contactsYaml {
      hero {
        badge
        title
        lead
      }
      contactInfo {
        phone
        email
        discord
        address
      }
      identification {
        name
        address
        ico
        vatNote
      }
      committeeIntro
      committee {
        name
        role
        region
        bio
        email
        discord
        phone
        image {
          childImageSharp {
            gatsbyImageData(width: 240, height: 240, placeholder: BLURRED)
          }
        }
      }
      commissions {
        name
        description
        icon
        formLink
        pageLink
        pageLinkText
        members {
          name
          role
          discord
          email
          image {
            childImageSharp {
              gatsbyImageData(width: 120, height: 120, placeholder: BLURRED)
            }
          }
        }
      }
      ctaBanner {
        title
        text
        discordText
        discordHref
      }
    }
  }
`;
