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
  invariant(yml.bpFormat?.html, "BP format data is required");
  invariant(yml.links?.public, "Public links are required");
  invariant(yml.links?.members, "Member links are required");
  invariant(yml.supporters, "Supporters data is required");
  invariant(yml.supportersDisclaimer, "Supporters disclaimer is required");

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
      {/* Section 1: Hero with two columns */}
      <section className="py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold mb-3">
              Debatní spolek Debatního deníku
            </h1>
            <p className="lead mb-4">
              Přidejte se k nám a objevte sílu argumentace. Naučíme vás myslet
              kriticky, mluvit přesvědčivě a naslouchat druhým.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <ClubPicker buttonVariant="lg" />
              {/* <a
                href="/organization/activities"
                className="btn btn-outline-primary btn-lg"
              >
                Naše další akvitity
              </a> */}
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className={`banner-slideshow rounded shadow${
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

      {/* Donation CTA */}
      <section className="py-4 px-4 rounded bg-primary-light my-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h3 className="fw-bold mb-2">Podpořte debatování v Česku</h3>
            <p className="mb-3 text-muted">
              Učíme mladé lidi argumentovat, naslouchat a kriticky myslet —
              zdarma a ve volném čase.
            </p>
            <a href="/podporte-nas" className="btn btn-primary">
              Chci podpořit spolek
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Cards */}
      <section className="py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 fw-bold mb-3">Proč debatovat?</h2>
            <p className="lead text-muted">
              Debatování není jen o vítězství v diskuzi. Je to způsob, jak lépe
              porozumět světu kolem sebe a stát se lepší verzí sebe sama.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {cards.map((card: CardData, index: number) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <GatsbyImage
                  image={card.image}
                  alt={card.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text text-muted">{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Debate Format */}
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

      {/* Section 4: External Links */}
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
