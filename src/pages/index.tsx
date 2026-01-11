import React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ClubPicker from "../components/ClubPicker";
import SmartAnchor from "../components/SmartAnchor";

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

const publicLinks: LinkItem[] = [
  { title: "YouTube kanál", href: "https://youtube.com" },
  { title: "Instagram", href: "https://instagram.com" },
  { title: "Facebook", href: "https://facebook.com" },
];

const memberLinks: LinkItem[] = [
  { title: "Interní portál", href: "https://example.com/portal" },
  { title: "Kalendář akcí", href: "https://example.com/calendar" },
  { title: "Materiály ke stažení", href: "https://example.com/materials" },
];

const cards = [
  {
    image: "https://picsum.photos/seed/card1/400/200",
    title: "Naučte se argumentovat",
    text: "Rozvíjejte své kritické myšlení a schopnost přesvědčivě prezentovat své názory. Naučíte se strukturovat své myšlenky, analyzovat argumenty druhých a reagovat na protiargumenty. Tyto dovednosti vám pomohou nejen v debatách, ale i v běžném životě.",
  },
  {
    image: "https://picsum.photos/seed/card2/400/200",
    title: "Poznejte nové lidi",
    text: "Staňte se součástí komunity mladých lidí, kteří chtějí měnit svět k lepšímu. V našem klubu potkáte přátele z různých škol a měst, se kterými budete sdílet společné zážitky z turnajů, workshopů a společenských akcí.",
  },
  {
    image: "https://picsum.photos/seed/card3/400/200",
    title: "Cestujte na turnaje",
    text: "Zúčastněte se debatních soutěží po celé České republice i v zahraničí. Každý rok pořádáme desítky turnajů pro začátečníky i pokročilé. Nejlepší debatéři se mohou kvalifikovat na mezinárodní soutěže v Evropě i zámoří.",
  },
  {
    image: "https://picsum.photos/seed/card4/400/200",
    title: "Získejte sebevědomí",
    text: "Překonejte strach z veřejného vystupování a naučte se mluvit před publikem. Postupně si budujete jistotu při prezentování svých názorů. Mnoho našich absolventů dnes pracuje jako právníci, politici nebo manažeři.",
  },
  {
    image: "https://picsum.photos/seed/card5/400/200",
    title: "Rozšiřte si obzory",
    text: "Diskutujte o aktuálních tématech z politiky, ekonomiky, vědy i kultury. Každá debata vás donutí prozkoumat nové téma do hloubky a podívat se na něj z různých úhlů pohledu. Stanete se informovanějším občanem.",
  },
  {
    image: "https://picsum.photos/seed/card6/400/200",
    title: "Připravte se na budoucnost",
    text: "Dovednosti z debatování využijete ve škole, v práci i v osobním životě. Kritické myšlení, rétorika a schopnost rychle se zorientovat v novém tématu jsou kompetence, které oceňují zaměstnavatelé i univerzity po celém světě.",
  },
];

const Home: React.FC = () => {
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
              <a
                href="/organization/activities"
                className="btn btn-outline-primary btn-lg"
              >
                Naše další akvitity
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <img
              src="https://picsum.photos/seed/hero/800/600"
              alt="Debatní klub"
              className="img-fluid rounded shadow"
            />
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
          {cards.map((card, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <img
                  src={card.image}
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
            <p className="lead">
              V našem spolku se věnujeme formátu British Parliamentary (BP),
              který je nejrozšířenějším debatním formátem v České republice i ve
              světě. Tento formát vznikl podle vzoru debat v britském parlamentu
              a dnes se používá na všech významných mezinárodních soutěžích,
              včetně mistrovství Evropy a mistrovství světa.
            </p>
            <p className="lead">
              Každé debaty se účastní osm řečníků rozdělených do čtyř
              dvoučlenných týmů. Dva týmy tvoří vládní stranu, která obhajuje
              zadané téma (tzv. moci), a dva týmy představují opozici, která
              téma vyvrací. Týmy se dále dělí na „opening" (úvodní) a „closing"
              (závěrečné), přičemž každá pozice má své specifické strategické
              úkoly.
            </p>
            <p className="lead">
              Každý řečník má na svůj projev sedm minut. Během prvních a
              posledních minut projevu mohou protivníci vznášet tzv. points of
              information – krátké dotazy nebo námitky, na které řečník může,
              ale nemusí reagovat. Tato interaktivní složka dodává debatám
              dynamiku a testuje schopnost řečníků myslet na nohou.
            </p>
            <p className="lead">
              Formát BP rozvíjí širokou škálu dovedností: kritické myšlení,
              argumentaci, veřejné vystupování, týmovou spolupráci i schopnost
              rychle se zorientovat v novém tématu. Debatéři se učí nahlížet na
              problémy z různých úhlů pohledu a konstruktivně reagovat na názory
              druhých. Tyto dovednosti jsou cenné nejen v akademickém prostředí,
              ale i v profesním a osobním životě.
            </p>
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
    </Layout>
  );
};

export const Head = () => <SEO />;

export default Home;
