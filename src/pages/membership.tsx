import React, { useEffect, useRef, useState } from "react";
import { graphql, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HeroData {
  badge: string;
  title: string;
  lead: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

interface WhoCanJoinItem {
  icon: string;
  title: string;
  text: string;
}

interface WhoCanJoinData {
  badge: string;
  title: string;
  lead: string;
  statutesLink: string;
  items: WhoCanJoinItem[];
}

interface FeatureItem {
  icon: string;
  title: string;
  text: string;
}

interface RightsData {
  badge: string;
  title: string;
  lead: string;
  items: FeatureItem[];
}

interface ResponsibilitiesData {
  badge: string;
  title: string;
  lead: string;
  items: FeatureItem[];
}

interface FeePlan {
  title: string;
  amount: string;
  period: string;
  ks: string;
  note: string;
}

interface FeesData {
  badge: string;
  title: string;
  lead: string;
  decisionLink: string;
  decisionLinkText: string;
  monthly: FeePlan;
  yearly: FeePlan;
  voluntaryNote: string;
}

interface PaymentInfoData {
  title: string;
  accountNumber: string;
  ksMonthly: string;
  ksYearly: string;
  vsNote: string;
}

interface StepOption {
  title: string;
  desc: string;
  icon: string;
}

interface StepItem {
  stepNumber: number;
  title: string;
  text: string;
  badge?: string;
  contactsLink?: string;
  contactsText?: string;
  options?: StepOption[];
}

interface HowToJoinData {
  badge: string;
  title: string;
  lead: string;
  formFolderUrl: string;
  formButtonText: string;
  steps: StepItem[];
}

interface TerminationReason {
  icon: string;
  title: string;
  text: string;
}

interface TerminationData {
  badge: string;
  title: string;
  lead: string;
  statutesNote: string;
  statutesLink: string;
  statutesButtonText: string;
  reasons: TerminationReason[];
}

interface CtaBannerData {
  title: string;
  text: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
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

    const sections = el.querySelectorAll<HTMLElement>(".membership-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("membership-reveal--visible");
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

export default function MembershipPage({ data }: PageProps<any>) {
  const yml = data?.membershipYaml;
  invariant(yml, "membership.yml data is required");

  /* --- Hero --- */
  invariant(yml.hero, "Hero data is required");
  const hero = yml.hero as HeroData;

  /* --- Who Can Join --- */
  invariant(yml.whoCanJoin, "WhoCanJoin data is required");
  const whoCanJoin = yml.whoCanJoin as WhoCanJoinData;

  /* --- Rights --- */
  invariant(yml.rights, "Rights data is required");
  const rights = yml.rights as RightsData;

  /* --- Responsibilities --- */
  invariant(yml.responsibilities, "Responsibilities data is required");
  const responsibilities = yml.responsibilities as ResponsibilitiesData;

  /* --- Fees --- */
  invariant(yml.fees, "Fees data is required");
  const fees = yml.fees as FeesData;

  /* --- Payment Info --- */
  invariant(yml.paymentInfo, "PaymentInfo data is required");
  const paymentInfo = yml.paymentInfo as PaymentInfoData;

  /* --- How To Join --- */
  invariant(yml.howToJoin, "HowToJoin data is required");
  const howToJoin = yml.howToJoin as HowToJoinData;

  /* --- Termination --- */
  invariant(yml.termination, "Termination data is required");
  const termination = yml.termination as TerminationData;

  /* --- CTA Banner --- */
  invariant(yml.ctaBanner, "CtaBanner data is required");
  const ctaBanner = yml.ctaBanner as CtaBannerData;

  const wrapperRef = useScrollReveal();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(paymentInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Layout>
      <div ref={wrapperRef}>
        {/* ============================================================ */}
        {/* HERO                                                         */}
        {/* ============================================================ */}
        <section className="pt-4 pt-lg-5 pb-3 pb-lg-4 membership-reveal">
          <div className="row justify-content-center">
            <div className="col-lg-9 text-center">
              {hero.badge && (
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-light text-primary fw-semibold small mb-3">
                  <i className="bi bi-people-fill"></i> {hero.badge}
                </div>
              )}
              <h1 className="display-4 fw-bold mb-3">{hero.title}</h1>
              <p className="lead mb-4 text-muted mx-auto" style={{ maxWidth: 760 }}>
                {hero.lead}
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap align-items-center">
                <a
                  href={hero.primaryButtonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <i className="bi bi-file-earmark-pdf me-2"></i>
                  {hero.primaryButtonText}
                </a>
                <a
                  href={hero.secondaryButtonHref}
                  className="btn btn-outline-primary btn-lg"
                >
                  <i className="bi bi-arrow-down-circle me-2"></i>
                  {hero.secondaryButtonText}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* KDO SE MŮŽE STÁT ČLENEM                                     */}
        {/* ============================================================ */}
        <section className="py-5 membership-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {whoCanJoin.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {whoCanJoin.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{whoCanJoin.title}</h2>
              <p className="lead text-muted">{whoCanJoin.lead}</p>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {whoCanJoin.items.map((item: WhoCanJoinItem, index: number) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 p-4 shadow-sm border-0">
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

          {whoCanJoin.statutesLink && (
            <div className="text-center mt-3">
              <a
                href={whoCanJoin.statutesLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="bi bi-book me-2"></i>
                Přečíst stanovy spolku
              </a>
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* PRÁVA ČLENA                                                  */}
        {/* ============================================================ */}
        <section className="py-5 membership-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {rights.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {rights.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{rights.title}</h2>
              <p className="lead text-muted">{rights.lead}</p>
            </div>
          </div>

          <div className="row g-4">
            {rights.items.map((item: FeatureItem, index: number) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 p-4 shadow-sm border-0">
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

            {/* 6th Card: Summary Equality */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 shadow-sm border-0 bg-primary-light">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-shield-check fs-4"></i>
                  </div>
                  <h5 className="card-title mb-0 fw-bold">Rovnost členů</h5>
                </div>
                <p className="card-text text-muted mb-0">
                  Všichni členové jsou si rovni. Neexistují kategorie členství s
                  rozdílnými výsadami — každý hlas má stejnou váhu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* POVINNOSTI ČLENA                                             */}
        {/* ============================================================ */}
        <section className="py-5 px-4 rounded bg-primary-light my-5 shadow-sm membership-reveal">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              {responsibilities.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {responsibilities.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">
                {responsibilities.title}
              </h2>
              <p className="lead text-muted">{responsibilities.lead}</p>
            </div>
          </div>

          <div className="row g-4">
            {responsibilities.items.map((item: FeatureItem, index: number) => (
              <div key={index} className="col-sm-6 col-lg-3">
                <div className="card h-100 p-4 shadow-sm border-0 bg-white">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{ width: "44px", height: "44px" }}
                    >
                      <i className={`bi ${item.icon} fs-5`}></i>
                    </div>
                    <h6 className="card-title mb-0 fw-bold">{item.title}</h6>
                  </div>
                  <p className="card-text text-muted small mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* ČLENSKÝ PŘÍSPĚVEK & PLATEBNÍ ÚDAJE                           */}
        {/* ============================================================ */}
        <section className="py-5 membership-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {fees.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {fees.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{fees.title}</h2>
              <p className="lead text-muted">{fees.lead}</p>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="row g-4 justify-content-center mb-5">
            {/* Monthly */}
            <div className="col-md-6 col-lg-5">
              <div className="card h-100 p-4 membership-pricing-card shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary-light text-primary rounded-pill px-3 py-2 fw-semibold">
                      {fees.monthly.title}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="price-amount">{fees.monthly.amount}</span>
                    <span className="price-period ms-2">
                      / {fees.monthly.period}
                    </span>
                  </div>
                  <p className="text-muted small mb-0">{fees.monthly.note}</p>
                </div>
              </div>
            </div>

            {/* Yearly */}
            <div className="col-md-6 col-lg-5">
              <div className="card h-100 p-4 membership-pricing-card membership-pricing-card--featured shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary text-white rounded-pill px-3 py-2 fw-semibold">
                      {fees.yearly.title}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="price-amount">{fees.yearly.amount}</span>
                    <span className="price-period ms-2">
                      / {fees.yearly.period}
                    </span>
                  </div>
                  <p className="text-muted small mb-0">{fees.yearly.note}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Voluntary Contribution note */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div className="p-3 px-4 rounded bg-primary-light border-0 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-heart-fill"></i>
                </div>
                <div className="small text-muted mb-0">
                  <strong>Dobrovolné navýšení:</strong> {fees.voluntaryNote}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Box */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <div className="card p-4 p-lg-5 shadow-sm border-0 bg-white">
                <div className="row align-items-center g-4">
                  <div className="col-md-7">
                    <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-bank fs-4 text-primary"></i>
                      {paymentInfo.title}
                    </h4>
                    <div className="mb-3">
                      <div className="text-muted small text-uppercase fw-semibold mb-1">
                        Číslo bankovního účtu spolku
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className="fs-4 fw-bold font-monospace text-primary">
                          {paymentInfo.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className={`btn btn-sm membership-copy-btn ${
                            copied ? "btn-success" : "btn-outline-primary"
                          }`}
                        >
                          <i
                            className={`bi ${
                              copied ? "bi-check-lg" : "bi-clipboard"
                            } me-1`}
                          ></i>
                          {copied ? "Zkopírováno!" : "Kopírovat číslo účtu"}
                        </button>
                      </div>
                    </div>
                    <div className="row g-3 mt-1">
                      <div className="col-sm-6">
                        <div className="text-muted small">
                          <strong>Konstantní symbol:</strong>
                        </div>
                        <div className="small">
                          {paymentInfo.ksMonthly} (měsíční)
                          <br />
                          {paymentInfo.ksYearly} (roční)
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="text-muted small">
                          <strong>Variabilní symbol:</strong>
                        </div>
                        <div className="small">{paymentInfo.vsNote}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-5 text-md-end">
                    {fees.decisionLink && (
                      <a
                        href={fees.decisionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-file-earmark-ruled me-2"></i>
                        {fees.decisionLinkText || "Rozhodnutí o příspěvcích"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* VZNIK ČLENSTVÍ – KROK ZA KROKEM                             */}
        {/* ============================================================ */}
        <section id="jak-se-stat-clenem" className="py-5 membership-reveal">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              {howToJoin.badge && (
                <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {howToJoin.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{howToJoin.title}</h2>
              <p className="lead text-muted">{howToJoin.lead}</p>
            </div>
          </div>

          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <div className="d-flex flex-column gap-4">
                {howToJoin.steps.map((step: StepItem, index: number) => (
                  <div
                    key={index}
                    className="card p-4 shadow-sm border-0"
                  >
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="membership-step-badge">
                        {step.stepNumber}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <h4 className="fw-bold mb-0">{step.title}</h4>
                          {step.badge && (
                            <span className="badge bg-primary-light text-primary rounded-pill px-3 py-1">
                              {step.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-muted mt-2 mb-0">{step.text}</p>
                      </div>
                    </div>

                    {/* Step 1 CTA button */}
                    {step.stepNumber === 1 && howToJoin.formFolderUrl && (
                      <div className="mt-3 ps-lg-5">
                        <a
                          href={howToJoin.formFolderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          <i className="bi bi-folder-symlink me-2"></i>
                          {howToJoin.formButtonText ||
                            "Otevřít složku s přihláškami"}
                        </a>
                      </div>
                    )}

                    {/* Step 2 Sub-options */}
                    {step.options && step.options.length > 0 && (
                      <div className="row g-3 mt-2 ps-lg-5">
                        {step.options.map((opt: StepOption, oIndex: number) => (
                          <div key={oIndex} className="col-md-4">
                            <div className="membership-option-card h-100">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <i
                                  className={`bi ${opt.icon} text-primary fs-5`}
                                ></i>
                                <h6 className="fw-bold mb-0">{opt.title}</h6>
                              </div>
                              <p className="text-muted small mb-0">
                                {opt.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Step 3 Contacts Link */}
                    {step.contactsLink && (
                      <div className="mt-3 ps-lg-5">
                        <a
                          href={step.contactsLink}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-people me-2"></i>
                          {step.contactsText || "Kontakty na členy výboru"}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ZÁNIK ČLENSTVÍ                                               */}
        {/* ============================================================ */}
        <section className="py-5 membership-reveal">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              {termination.badge && (
                <span className="badge bg-secondary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                  {termination.badge}
                </span>
              )}
              <h2 className="display-5 fw-bold mb-3">{termination.title}</h2>
              <p className="lead text-muted">{termination.lead}</p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row g-3 mb-4">
                {termination.reasons.map(
                  (reason: TerminationReason, index: number) => (
                    <div key={index} className="col-sm-6 col-lg-3">
                      <div className="card h-100 p-3 shadow-sm border-0 text-center">
                        <div
                          className="rounded-circle bg-light text-secondary d-flex align-items-center justify-content-center mx-auto mb-2"
                          style={{ width: "44px", height: "44px" }}
                        >
                          <i className={`bi ${reason.icon} fs-5`}></i>
                        </div>
                        <h6 className="fw-bold mb-1">{reason.title}</h6>
                        <p className="text-muted small mb-0">{reason.text}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="text-center">
                <p className="text-muted small mb-3">
                  {termination.statutesNote}
                </p>
                {termination.statutesLink && (
                  <a
                    href={termination.statutesLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    {termination.statutesButtonText || "Stanovy spolku"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CTA BANNER                                                   */}
        {/* ============================================================ */}
        <section className="py-5 px-4 rounded bg-primary-light my-5 shadow-sm text-center membership-reveal">
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
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    {ctaBanner.primaryButtonText}
                  </a>
                )}
                {ctaBanner.secondaryButtonHref && (
                  <a
                    href={ctaBanner.secondaryButtonHref}
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    {ctaBanner.secondaryButtonText}
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
    title="Členství ve spolku"
    description="Členství v Debatním spolku Debatního deníku. Podmínky vstupu, práva a povinnosti člena, členské příspěvky a postup podání přihlášky."
    pathname="/membership"
  />
);

export const query = graphql`
  query MembershipPage {
    markdownRemark(frontmatter: { path: { eq: "/membership" } }) {
      html
      frontmatter {
        title
        path
      }
    }
    membershipYaml {
      hero {
        badge
        title
        lead
        primaryButtonText
        primaryButtonHref
        secondaryButtonText
        secondaryButtonHref
      }
      whoCanJoin {
        badge
        title
        lead
        statutesLink
        items {
          icon
          title
          text
        }
      }
      rights {
        badge
        title
        lead
        items {
          icon
          title
          text
        }
      }
      responsibilities {
        badge
        title
        lead
        items {
          icon
          title
          text
        }
      }
      fees {
        badge
        title
        lead
        decisionLink
        decisionLinkText
        monthly {
          title
          amount
          period
          ks
          note
        }
        yearly {
          title
          amount
          period
          ks
          note
        }
        voluntaryNote
      }
      paymentInfo {
        title
        accountNumber
        ksMonthly
        ksYearly
        vsNote
      }
      howToJoin {
        badge
        title
        lead
        formFolderUrl
        formButtonText
        steps {
          stepNumber
          title
          text
          badge
          contactsLink
          contactsText
          options {
            title
            desc
            icon
          }
        }
      }
      termination {
        badge
        title
        lead
        statutesNote
        statutesLink
        statutesButtonText
        reasons {
          icon
          title
          text
        }
      }
      ctaBanner {
        title
        text
        primaryButtonText
        primaryButtonHref
        secondaryButtonText
        secondaryButtonHref
        discordButtonText
        discordHref
      }
    }
  }
`;
