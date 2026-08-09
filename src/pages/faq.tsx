import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

interface FaqItem {
  id: string;
  category: "start" | "meetings" | "membership";
  icon: string;
  question: string;
  answer: React.ReactNode;
}

const CATEGORIES = [
  { id: "all", label: "Všechny otázky", icon: "bi-grid-fill" },
  { id: "start", label: "První návštěva & Začátky", icon: "bi-rocket-takeoff-fill" },
  { id: "meetings", label: "Fungování klubů & Schůzky", icon: "bi-calendar3" },
  { id: "membership", label: "Členství & Spolek", icon: "bi-people-fill" },
];

const FAQ_DATA: FaqItem[] = [
  {
    id: "zapojit-se",
    category: "start",
    icon: "bi-person-plus-fill",
    question: "Jak se můžu zapojit do debatního klubu?",
    answer: (
      <p className="mb-0">
        Přijď jednoduše na jednu z debatních schůzek. Rádi přivítáme každého
        zájemce. Není třeba žádný speciální talent ani zkušenosti, stačí zájem
        debatovat. Získáš dovednosti užitečné v běžném životě. Diskutujeme
        převážně v češtině, ale můžeš si zkusit i angličtinu.
      </p>
    ),
  },
  {
    id: "co-umeti",
    category: "start",
    icon: "bi-play-circle-fill",
    question: "Co musím umět před první debatou?",
    answer: (
      <p className="mb-0">
        Stačí si pustit video se základními pravidly Britské parlamentní debaty.
        Vysvětlení i ukázkovou debatu najdeš v přihlašovacím dotazníku.
      </p>
    ),
  },
  {
    id: "jen-podivat",
    category: "start",
    icon: "bi-eye-fill",
    question: "Můžu se na debatu přijít jen podívat?",
    answer: (
      <div>
        <p className="mb-2">
          Ano, přijď kdykoliv. V tomto případě se nemusíš ani přihlašovat.
        </p>
        <p className="text-muted small mb-0">
          <em>(Poznámka: V současnosti se nemůžeš přijít podívat na debatní klub online.)</em>
        </p>
      </div>
    ),
  },
  {
    id: "kdykoliv-v-roce",
    category: "start",
    icon: "bi-calendar-event-fill",
    question: "Vadí, když přijdu poprvé uprostřed semestru nebo během zkouškového období?",
    answer: (
      <div>
        <p className="mb-3">
          Nevadí, přijít můžeš kdykoliv během roku. Nemusíš být studentem konkrétní školy, debaty jsou otevřené všem zájemcům.
        </p>
        <div className="p-3 rounded bg-primary-light border border-primary border-opacity-25">
          <div className="d-flex align-items-start">
            <i className="bi bi-lightbulb-fill text-primary fs-5 me-2 mt-n1"></i>
            <div>
              <strong>Tip:</strong> Mnoho členů spolku přišlo na první setkání s nějakým svým kamarádem. Později se přiznali, že by se sami přijít báli, a tak raději někoho přemluvili, aby šel s nimi.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "kedy-a-kde",
    category: "meetings",
    icon: "bi-geo-alt-fill",
    question: "Jak často a kde se debaty konají, probíhají i během léta?",
    answer: (
      <p className="mb-0">
        Debaty se konají pravidelně v Praze, Plzni a Online, a to i během letních prázdnin. Adresy setkání najdeš vždy v přihlašovacím dotazníku.
      </p>
    ),
  },
  {
    id: "nutne-prihlasit",
    category: "meetings",
    icon: "bi-calendar-check-fill",
    question: "Je nutné se na debaty předem přihlásit?",
    answer: (
      <p className="mb-0">
        Ano, ideálně do soboty (Praha), neděle (Plzeň) a úterý (Online). Můžeš se přihlásit i později, ale nemusí už být volné místo.
      </p>
    ),
  },
  {
    id: "odhlaseni",
    category: "meetings",
    icon: "bi-box-arrow-right",
    question: "Jak se mohu odhlásit z debaty?",
    answer: (
      <p className="mb-0">
        Odhlašování probíhá na Discordu v kanálu <code className="bg-light px-2 py-1 rounded text-primary">#odhlašování</code> příslušné pobočky.
      </p>
    ),
  },
  {
    id: "po-debate",
    category: "meetings",
    icon: "bi-cup-hot-fill",
    question: "Kam se chodí po debatě?",
    answer: (
      <p className="mb-0">
        Po debatách obvykle zamíříme do nedaleké restaurace, v létě také do parků.
      </p>
    ),
  },
  {
    id: "o-cem-debatujeme",
    category: "meetings",
    icon: "bi-chat-quote-fill",
    question: "O čem na klubu debatujete?",
    answer: (
      <p className="mb-0">
        Debatujeme o tématech z politiky, práva, ekonomie, sociologie i kultury – jednoduše o všem, co vyvolává diskusi.
      </p>
    ),
  },
  {
    id: "vekova-hranice",
    category: "meetings",
    icon: "bi-people-fill",
    question: "Je nějaká věková hranice pro účastníky debatního klubu?",
    answer: (
      <p className="mb-0">
        Není, debatovat může každý bez ohledu na věk.
      </p>
    ),
  },
  {
    id: "clenstvi-dobrovolne",
    category: "membership",
    icon: "bi-person-check-fill",
    question: "Mohu se účastnit debatního klubu pravidelně, aniž bych byl členem spolku?",
    answer: (
      <p className="mb-0">
        Ano, členství ve spolku je zcela dobrovolné.
      </p>
    ),
  },
  {
    id: "jak-se-stat-clenem",
    category: "membership",
    icon: "bi-award-fill",
    question: "Jak se mohu stát členem spolku a co získám?",
    answer: (
      <p className="mb-0">
        Přihlášku najdeš na Discordu v kanálu <code className="bg-light px-2 py-1 rounded text-primary">#odkazy</code>. Vyplněnou ji předej komukoliv z výboru spolku (Tadeáš, Tim a Lukáš). Členstvím získáš přístup do členského chatu, možnost jezdit na akce se slevou, komunitní obsah (fotky, edukační videa apod.) na spolkovém SharePointu, možnost podílet se na chodu spolku (organizace akcí, správa sociálních sítí apod.), přístup na členský Minecraft server a mnoho dalších výhod.
      </p>
    ),
  },
  {
    id: "rozdil-spolek-klub",
    category: "membership",
    icon: "bi-building",
    question: "Jaký je rozdíl mezi debatním spolkem a debatním klubem?",
    answer: (
      <p className="mb-0">
        Debatní spolek Debatního deníku je nezisková organizace, která zastřešuje chod debatních klubů v Praze a Plzni.
      </p>
    ),
  },
  {
    id: "jine-kluby",
    category: "membership",
    icon: "bi-map-fill",
    question: "Existují i jiné debatní kluby, např. mimo Plzeň a Prahu?",
    answer: (
      <div>
        <p className="mb-2">
          Pokud chceš debatovat onlinem, můžeš se přihlásit na náš online debatní klub!
        </p>
        <p className="mb-2">
          Ano, seznam všech debatních klubů v ČR najdeš na webu{" "}
          <a
            href="https://debatovani.cz/kontakt/mapa-debatnich-klubu/"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-semibold"
          >
            Asociace debatních klubů
          </a>
          . Na Slovensku debaty zastřešuje{" "}
          <a
            href="https://www.sda.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-semibold"
          >
            SDA
          </a>
          .
        </p>
        <p className="text-muted small mb-0">
          <em>(Pozor! Ostatní kluby nespadají pod naši organizaci.)</em>
        </p>
      </div>
    ),
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const qLower = item.question.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        qLower.includes(searchLower) ||
        (typeof item.answer === "string" &&
          item.answer.toLowerCase().includes(searchLower));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const allFilteredOpen =
    filteredFaqs.length > 0 &&
    filteredFaqs.every((item) => openIds.has(item.id));

  const toggleExpandAll = () => {
    if (allFilteredOpen) {
      setOpenIds(new Set());
    } else {
      setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
    }
  };

  return (
    <Layout>
      <section className="py-5">
        {/* Header Title */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Nejčastěji kladené otázky</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: 720 }}>
            Máte dotazy ohledně první návštěvy, debatování nebo členství ve spolku?
            Zde najdete odpovědi na vše, co vás zajímá.
          </p>
        </div>

        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
              <input
                type="text"
                className="form-control form-control-lg ps-5 rounded-pill shadow-sm border-2"
                placeholder="Hledat v otázkách (např. 'registrace', 'věk', 'poplatky')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="bi bi-x-circle-fill fs-5"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Controls */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 ${
                  activeCategory === cat.id
                    ? "btn-primary shadow-sm"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <i className={`bi ${cat.icon} me-2`}></i>
                {cat.label}
              </button>
            ))}
          </div>

          {filteredFaqs.length > 0 && (
            <button
              type="button"
              className="btn btn-link text-decoration-none text-muted p-0 ms-auto"
              onClick={toggleExpandAll}
            >
              <i
                className={`bi ${
                  allFilteredOpen
                    ? "bi-arrows-collapse"
                    : "bi-arrows-expand"
                } me-1`}
              ></i>
              {allFilteredOpen ? "Sbalit vše" : "Rozbalit vše"}
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-5 rounded bg-light my-4">
            <i className="bi bi-search text-muted fs-1 mb-3 d-block"></i>
            <h5>Žádná odpověď nenalezena</h5>
            <p className="text-muted mb-3">
              Zkuste zadat jiné klíčové slovo nebo zvolit jinou kategorii.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-4"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Zobrazit všechny otázky
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`faq-accordion-item${isOpen ? " open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="d-flex align-items-center me-3">
                      <span className="rounded-circle bg-primary-light text-primary d-inline-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: 40, height: 40 }}>
                        <i className={`bi ${faq.icon} fs-5`}></i>
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <i className="bi bi-chevron-down faq-chevron text-muted fs-5 ms-2 flex-shrink-0"></i>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-content">
                      <hr className="my-2 opacity-10" />
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Discord Help Banner */}
        <div className="card bg-primary-light border-0 p-4 p-md-5 mt-5 text-center shadow-sm">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                <i className="bi bi-discord fs-2"></i>
              </div>
              <h3 className="fw-bold mb-2">Nenašli jste odpověď?</h3>
              <p className="lead mb-4 text-muted">
                Pokud máte jakékoliv další dotazy, neváhejte se zeptat v kanálu <strong>#dotazy</strong> na našem Discordu!
              </p>
              <a
                href="https://discord.gg/qpp8v52AgP"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg px-4 shadow-sm"
              >
                <i className="bi bi-discord me-2"></i>
                Přejít na Discord kanál #dotazy
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const Head = () => <SEO title="Často kladené otázky | Debatní spolek Debatního deníku" />;
