import React, { useEffect, useState } from "react";
import { graphql, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ClubPicker from "../components/ClubPicker";
import SmartAnchor from "../components/SmartAnchor";
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
  ImageDataLike,
} from "gatsby-plugin-image";

interface LinkItem {
  title: string;
  href: string;
}

interface LinkGroupProps {
  title: string;
  links: LinkItem[];
}

const LinkGroup: React.FC<LinkGroupProps> = ({ title, links }) => (
  <>
    <h3 className="fw-bold mb-4">{title}</h3>
    <div className="row g-3 mb-5">
      {links.map((link, index) => (
        <div key={index} className="col-sm-6 col-lg-4">
          <SmartAnchor
            href={link.href}
            className="btn btn-outline-primary w-100 link-section-btn"
          >
            {link.title}
          </SmartAnchor>
        </div>
      ))}
    </div>
  </>
);

interface LinkSectionProps {
  title: string;
  groups: LinkGroupProps[];
}

const LinkSection: React.FC<LinkSectionProps> = ({ title, groups }) => (
  <section className="py-5 px-4 rounded bg-primary-light">
    <h2 className="display-5 fw-bold mb-5 text-center">{title}</h2>
    {groups.map((group, index) => (
      <LinkGroup key={index} title={group.title} links={group.links} />
    ))}
  </section>
);

interface CardData {
  image: IGatsbyImageData;
  title: string;
  text: string;
}

interface HowToJoinItem {
  icon: string;
  title: string;
  text: string;
}

interface HowToJoinData {
  title: string;
  subtitle: string;
  items: HowToJoinItem[];
}

interface Supporter {
  src: string;
  name: string;
}

const CLUBS_LIST = [
  {
    name: "Debatní klub Praha",
    city: "Praha",
    badge: "Prezenčně",
    when: "Každé pondělí od 18:00",
    where: "ČVUT (Thákurova 2700/9, Dejvice)",
    path: "/clubs/prague",
    icon: "bi-buildings-fill",
  },
  {
    name: "Debatní klub Plzeň",
    city: "Plzeň",
    badge: "Prezenčně",
    when: "Každé úterý od 18:00",
    where: "ZČU (Jungmannova 153/1)",
    path: "/clubs/pilsen",
    icon: "bi-mortarboard-fill",
  },
  {
    name: "Debatní klub Domažlice",
    city: "Domažlice",
    badge: "Prezenčně",
    when: "Každá středa od 16:30",
    where: "SZŠ (Chodské náměstí 97)",
    path: "/clubs/domazlice",
    icon: "bi-geo-alt-fill",
  },
  {
    name: "Online debatní klub",
    city: "Online",
    badge: "Odkudkoliv",
    when: "Každý čtvrtek od 19:00",
    where: "Na Discord serveru spolku",
    path: "/clubs/online",
    icon: "bi-laptop-fill",
  },
];

export default function Home({ data }: PageProps<Queries.HomepageQuery>) {
  const yml = data.homepageYaml;
  invariant(yml, "HomepageSections.yml data is required");

  const bannerImages = yml.bannerImages;
  invariant(bannerImages?.length, "BannerImages are required");

  const slides: IGatsbyImageData[] = bannerImages.map((b) => {
    const img = getImage(b as ImageDataLike);
    invariant(img, "Banner image is required");
    return img;
  });

  // Order in which the slides are shown. Identity order for a deterministic
  // SSR/initial paint; the client shuffles it below for a fresh random order
  // (which also makes the first visible slide random) on every render.
  const [order, setOrder] = useState<number[]>(() => slides.map((_, i) => i));
  // Position within `order` of the currently visible slide.
  const [activeSlide, setActiveSlide] = useState<number>(0);
  // The crossfade is disabled for the initial shuffle so the SSR first image
  // doesn't visibly fade out; it's enabled once the random order is in place.
  const [animate, setAnimate] = useState<boolean>(false);

  // Auto-rotate the banner. The timer only runs on the client, so the build
  // output is stable. Skip entirely when there is just a single image.
  useEffect(() => {
    if (slides.length <= 1) return;

    // Fisher–Yates shuffle for a fresh random order each client render.
    const shuffled = slides.map((_, i) => i);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
    setActiveSlide(0);

    // Enable the crossfade only after the instant initial swap has painted.
    const animateId = setTimeout(() => setAnimate(true), 50);

    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => {
      clearTimeout(animateId);
      clearInterval(intervalId);
    };
  }, [slides.length]);

  invariant(yml.cards, "Cards data is required");
  invariant(yml.howToJoin, "HowToJoin data is required");
  invariant(yml.bpFormat?.html, "BP format data is required");
  invariant(yml.links?.public, "Public links are required");
  invariant(yml.links?.members, "Member links are required");
  invariant(yml.supporters, "Supporters data is required");
  invariant(yml.supportersDisclaimer, "Supporters disclaimer is required");

  const howToJoin = yml.howToJoin as HowToJoinData;

  const cards: CardData[] = yml.cards.map((c) => {
    invariant(c, "Card is required");

    const image = getImage(c.image as ImageDataLike);
    invariant(image, "Card image is required");
    invariant(c.title, "Card title is required");
    invariant(c.text, "Card text is required");

    return {
      image,
      title: c.title,
      text: c.text,
    };
  });

  const bpFormat: string = yml.bpFormat.html;

  const publicLinks: LinkItem[] = yml.links.public.map((link: unknown) => {
    const l = link as { title?: string; href?: string } | null;
    invariant(l, "Link is required");
    invariant(l.title, "Link title is required");
    invariant(l.href, "Link href is required");
    return { title: l.title, href: l.href };
  });

  const memberLinks: LinkItem[] = yml.links.members.map((link) => {
    const l = link as { title?: string; href?: string } | null;
    invariant(l, "Link is required");
    invariant(l.title, "Link title is required");
    invariant(l.href, "Link href is required");
    return { title: l.title, href: l.href };
  });

  const supporters: Supporter[] = yml.supporters.map((s) => {
    invariant(s, "Supporter is required");
    invariant(s.image?.publicURL, "Supporter image is required");
    invariant(s.name, "Supporter name is required");
    return { src: s.image.publicURL, name: s.name };
  });

  return (
    <Layout>
      {/* Section 1: Hero */}
      <section className="py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-light text-primary fw-semibold small mb-3">
              <i className="bi bi-stars"></i> Přijímáme nováčky po celý rok
            </div>
            <h1 className="display-4 fw-bold mb-3">
              Debatní spolek Debatního deníku
            </h1>
            <p className="lead mb-4 text-muted">
              Přidejte se k otevřené komunitě. Naučíme vás přesvědčivě argumentovat, pohotově reagovat a mluvit před lidmi bez obav.
            </p>
            <div className="d-flex gap-3 flex-wrap align-items-center mb-4">
              <ClubPicker buttonVariant="lg" />
              <a href="#jak-to-funguje" className="btn btn-outline-primary btn-lg">
                Jak to funguje?
              </a>
            </div>
            {/* Trust highlights */}
            <div className="row g-2 pt-3 border-top">
              <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-check-circle-fill text-success fs-6"></i>
                <span><strong>100% Zdarma</strong> a bez poplatků</span>
              </div>
              <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-check-circle-fill text-success fs-6"></i>
                <span><strong>Vhodné pro nováčky</strong> (vše vysvětlíme)</span>
              </div>
              <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-check-circle-fill text-success fs-6"></i>
                <span><strong>Otevřeno všem</strong> bez ohledu na věk</span>
              </div>
              <div className="col-sm-6 d-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-check-circle-fill text-success fs-6"></i>
                <span><strong>Praha • Plzeň • Domažlice • Online</strong></span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className={`banner-slideshow rounded shadow-lg${
                animate ? " banner-slideshow--animated" : ""
              }`}
            >
              {order.map((slideIndex, position) => (
                <GatsbyImage
                  key={slideIndex}
                  image={slides[slideIndex]}
                  alt="Debatní klub"
                  className={`banner-slide${
                    position === activeSlide ? " banner-slide--active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Jak se přihlásit a jak to funguje */}
      <section id="jak-to-funguje" className="py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
              Jednoduchý začátek
            </span>
            <h2 className="display-5 fw-bold mb-3">{howToJoin.title}</h2>
            <p className="lead text-muted">{howToJoin.subtitle}</p>
          </div>
        </div>
        <div className="row g-4 mb-5">
          {howToJoin.items.map((item: HowToJoinItem, index: number) => (
            <div key={index} className="col-md-6 col-lg-4">
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
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 text-center">
          <ClubPicker buttonVariant="lg" />
          <a href="/faq" className="btn btn-outline-primary btn-lg">
            <i className="bi bi-question-circle me-2"></i> Často kladené otázky
          </a>
        </div>
      </section>

      {/* Section 3: Naše debatní kluby */}
      <section className="py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
              Pobočky & Schůzky
            </span>
            <h2 className="display-5 fw-bold mb-3">Kde a kdy se scházíme?</h2>
            <p className="lead text-muted">
              Vyberte si pobočku, která vám nejvíce vyhovuje. Setkání probíhají pravidelně každý týden i během prázdnin.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {CLUBS_LIST.map((club, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="card h-100 p-4 shadow-sm border-0 transition-card d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div
                      className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center"
                      style={{ width: "44px", height: "44px" }}
                    >
                      <i className={`bi ${club.icon} fs-5`}></i>
                    </div>
                    <span className="badge bg-secondary text-white rounded-pill">
                      {club.badge}
                    </span>
                  </div>
                  <h5 className="fw-bold mb-2">{club.city}</h5>
                  <div className="mb-2 text-primary fw-semibold small">
                    <i className="bi bi-clock me-1"></i> {club.when}
                  </div>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1"></i> {club.where}
                  </p>
                </div>
                <div className="pt-2 border-top mt-auto">
                  <a
                    href={club.path}
                    className="btn btn-outline-primary btn-sm w-100 fw-semibold"
                  >
                    Podrobnosti o klubu &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Proč debatovat */}
      <section className="py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
              Přínosy
            </span>
            <h2 className="display-5 fw-bold mb-3">Proč debatovat?</h2>
            <p className="lead text-muted">
              Debatování není jen o vítězství v diskuzi. Je to způsob, jak lépe
              porozumět světu kolem sebe, získat odvahu a stát se lepší verzí sebe sama.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {cards.map((card: CardData, index: number) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 transition-card">
                <GatsbyImage
                  image={card.image}
                  alt={card.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-2">{card.title}</h5>
                  <p className="card-text text-muted">{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: High-Impact Mid-Page Conversion Banner */}
      <section className="py-5 px-4 rounded bg-primary-light my-5 shadow-sm text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="display-6 fw-bold mb-3">Chcete si to nezávazně vyzkoušet?</h2>
            <p className="lead mb-4 text-muted">
              Přijďte na nejbližší setkání. Nic to nestojí, poprvé se můžete jen dívat a nováčkům se vždy rádi věnujeme.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <ClubPicker buttonVariant="lg" />
              <a
                href="https://discord.gg/qpp8v52AgP"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg"
              >
                <i className="bi bi-discord me-2"></i> Discord komunita
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Debate Format */}
      <section className="py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="display-5 fw-bold mb-4 text-center">
              Jaký formát debatujeme?
            </h2>
            <div dangerouslySetInnerHTML={{ __html: bpFormat }}></div>
          </div>
        </div>
      </section>

      {/* Section 7: Donation CTA */}
      <section className="py-4 px-4 rounded bg-light border my-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h3 className="fw-bold mb-2">Podpořte debatování v Česku</h3>
            <p className="mb-3 text-muted">
              Učíme mladé lidi argumentovat, naslouchat a kriticky myslet —
              zdarma a ve volném čase.
            </p>
            <a href="/podporte-nas" className="btn btn-outline-primary">
              Chci podpořit spolek
            </a>
          </div>
        </div>
      </section>

      {/* Section 8: External Links */}
      <LinkSection
        title="Odkazy"
        groups={[
          { title: "Pro veřejnost", links: publicLinks },
          { title: "Pro členy", links: memberLinks },
        ]}
      />

      {/* Section 5: Supporters */}
      <section className="py-5">
        <h2 className="display-6 fw-bold mb-4 text-center">Podporují nás</h2>
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5">
          {supporters.map((s, i) => (
            <img
              key={i}
              src={s.src}
              alt={s.name}
              title={s.name}
              className="supporter-logo"
            />
          ))}
        </div>
        <p
          className="text-center text-muted small mt-4 mb-0 mx-auto"
          style={{ maxWidth: 720 }}
        >
          {yml.supportersDisclaimer}
        </p>
      </section>
    </Layout>
  );
}

export const Head = () => <SEO />;

export const query = graphql`
  query Homepage {
    homepageYaml {
      bannerImages {
        childImageSharp {
          gatsbyImageData(width: 600, height: 450, placeholder: BLURRED)
        }
      }
      cards {
        image {
          childImageSharp {
            gatsbyImageData(width: 416, height: 178, placeholder: BLURRED)
          }
        }
        text
        title
      }
      howToJoin {
        title
        subtitle
        items {
          icon
          title
          text
        }
      }
      links {
        members {
          title
          href
        }
        public {
          href
          title
        }
      }
      bpFormat {
        html
      }
      supporters {
        image {
          publicURL
        }
        name
      }
      supportersDisclaimer
    }
  }
`;
