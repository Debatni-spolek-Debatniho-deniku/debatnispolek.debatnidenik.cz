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

interface HeroData {
  badge: string;
  title: string;
  lead: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

interface HowToJoinItem {
  icon: string;
  title: string;
  text: string;
}

interface HowToJoinData {
  badge?: string;
  title: string;
  subtitle: string;
  faqButtonText?: string;
  faqButtonHref?: string;
  items: HowToJoinItem[];
}

interface ClubItem {
  name: string;
  city: string;
  badge: string;
  when: string;
  where: string;
  path: string;
  icon: string;
}

interface ClubsSectionData {
  badge: string;
  title: string;
  subtitle: string;
  detailButtonText: string;
  clubs: ClubItem[];
}

interface WhyDebateData {
  badge: string;
  title: string;
  subtitle: string;
}

interface CardData {
  image: IGatsbyImageData;
  title: string;
  text: string;
}

interface CtaBannerData {
  title: string;
  text: string;
  discordButtonText: string;
  discordHref: string;
}

interface DonationCtaData {
  title: string;
  text: string;
  buttonText: string;
  buttonHref: string;
}

interface Supporter {
  src: string;
  name: string;
}

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

  const [order, setOrder] = useState<number[]>(() => slides.map((_, i) => i));
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (slides.length <= 1) return;

    const shuffled = slides.map((_, i) => i);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
    setActiveSlide(0);

    const animateId = setTimeout(() => setAnimate(true), 50);

    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => {
      clearTimeout(animateId);
      clearInterval(intervalId);
    };
  }, [slides.length]);

  invariant(yml.hero, "Hero data is required");
  invariant(yml.howToJoin, "HowToJoin data is required");
  invariant(yml.clubsSection, "ClubsSection data is required");
  invariant(yml.whyDebate, "WhyDebate data is required");
  invariant(yml.cards, "Cards data is required");
  invariant(yml.ctaBanner, "CtaBanner data is required");
  invariant(yml.bpFormat?.html, "BP format data is required");
  invariant(yml.donationCta, "DonationCta data is required");
  invariant(yml.links?.public, "Public links are required");
  invariant(yml.links?.members, "Member links are required");
  invariant(yml.supporters, "Supporters data is required");
  invariant(yml.supportersDisclaimer, "Supporters disclaimer is required");

  const hero = yml.hero as HeroData;
  const howToJoin = yml.howToJoin as HowToJoinData;
  const clubsSection = yml.clubsSection as ClubsSectionData;
  const whyDebate = yml.whyDebate as WhyDebateData;
  const ctaBanner = yml.ctaBanner as CtaBannerData;
  const donationCta = yml.donationCta as DonationCtaData;
  const bpFormatTitle = yml.bpFormatTitle || "Jaký formát debatujeme?";
  const linksTitle = yml.linksTitle || "Odkazy";
  const supportersSectionTitle = yml.supportersSectionTitle || "Podporují nás";

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
            {hero.badge && (
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-light text-primary fw-semibold small mb-3">
                <i className="bi bi-stars"></i> {hero.badge}
              </div>
            )}
            <h1 className="display-4 fw-bold mb-3">{hero.title}</h1>
            <p className="lead mb-4 text-muted">{hero.lead}</p>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              <ClubPicker buttonVariant="lg" />
              {hero.secondaryButtonText && (
                <a
                  href={hero.secondaryButtonHref || "#jak-to-funguje"}
                  className="btn btn-outline-primary btn-lg"
                >
                  {hero.secondaryButtonText}
                </a>
              )}
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
                  alt={hero.title}
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
            {howToJoin.badge && (
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                {howToJoin.badge}
              </span>
            )}
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
          <a
            href={howToJoin.faqButtonHref || "/faq"}
            className="btn btn-outline-primary btn-lg"
          >
            <i className="bi bi-question-circle me-2"></i>{" "}
            {howToJoin.faqButtonText || "Často kladené otázky"}
          </a>
        </div>
      </section>

      {/* Section 3: Naše debatní kluby */}
      <section className="py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            {clubsSection.badge && (
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                {clubsSection.badge}
              </span>
            )}
            <h2 className="display-5 fw-bold mb-3">{clubsSection.title}</h2>
            <p className="lead text-muted">{clubsSection.subtitle}</p>
          </div>
        </div>
        <div className="row g-4">
          {clubsSection.clubs.map((club: ClubItem, index: number) => (
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
                    {clubsSection.detailButtonText || "Podrobnosti o klubu"} &rarr;
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
            {whyDebate.badge && (
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 text-uppercase mb-2">
                {whyDebate.badge}
              </span>
            )}
            <h2 className="display-5 fw-bold mb-3">{whyDebate.title}</h2>
            <p className="lead text-muted">{whyDebate.subtitle}</p>
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
                  <i className="bi bi-discord me-2"></i>{" "}
                  {ctaBanner.discordButtonText || "Discord komunita"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Debate Format */}
      <section className="py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="display-5 fw-bold mb-4 text-center">
              {bpFormatTitle}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: bpFormat }}></div>
          </div>
        </div>
      </section>

      {/* Section 7: Donation CTA */}
      <section className="py-4 px-4 rounded bg-light border my-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h3 className="fw-bold mb-2">{donationCta.title}</h3>
            <p className="mb-3 text-muted">{donationCta.text}</p>
            <a
              href={donationCta.buttonHref || "/podporte-nas"}
              className="btn btn-outline-primary"
            >
              {donationCta.buttonText || "Chci podpořit spolek"}
            </a>
          </div>
        </div>
      </section>

      {/* Section 8: External Links */}
      <LinkSection
        title={linksTitle}
        groups={[
          { title: "Pro veřejnost", links: publicLinks },
          { title: "Pro členy", links: memberLinks },
        ]}
      />

      {/* Section 9: Supporters */}
      <section className="py-5">
        <h2 className="display-6 fw-bold mb-4 text-center">
          {supportersSectionTitle}
        </h2>
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
      hero {
        badge
        title
        lead
        secondaryButtonText
        secondaryButtonHref
      }
      howToJoin {
        badge
        title
        subtitle
        faqButtonText
        faqButtonHref
        items {
          icon
          title
          text
        }
      }
      clubsSection {
        badge
        title
        subtitle
        detailButtonText
        clubs {
          name
          city
          badge
          when
          where
          path
          icon
        }
      }
      whyDebate {
        badge
        title
        subtitle
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
      ctaBanner {
        title
        text
        discordButtonText
        discordHref
      }
      bpFormatTitle
      bpFormat {
        html
      }
      donationCta {
        title
        text
        buttonText
        buttonHref
      }
      linksTitle
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
      supportersSectionTitle
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
