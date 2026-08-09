import React, { useState, useMemo } from "react";
import { graphql, PageProps } from "gatsby";
import invariant from "tiny-invariant";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

export default function FAQPage({ data }: PageProps<Queries.FaqPageQuery>) {
  const faqData = data.faqYaml;
  invariant(faqData, "faq.yml data is required");
  invariant(faqData.categories, "categories are required");
  invariant(faqData.questions, "questions are required");

  const categories = faqData.categories.map((c) => {
    invariant(c, "Category is required");
    invariant(c.id, "Category id is required");
    invariant(c.label, "Category label is required");
    invariant(c.icon, "Category icon is required");
    return {
      id: c.id,
      label: c.label,
      icon: c.icon,
    };
  });

  const questions = faqData.questions.map((q) => {
    invariant(q, "Question is required");
    invariant(q.id, "Question id is required");
    invariant(q.category, "Question category is required");
    invariant(q.icon, "Question icon is required");
    invariant(q.question, "Question title is required");
    invariant(q.answer?.html, "Question answer html is required");
    return {
      id: q.id,
      category: q.category,
      icon: q.icon,
      question: q.question,
      answerHtml: q.answer.html,
      tip: q.tip,
    };
  });

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
    return questions.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const qLower = item.question.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const aText = item.answerHtml.replace(/<[^>]*>?/gm, "").toLowerCase();
      const matchesSearch =
        !searchLower ||
        qLower.includes(searchLower) ||
        aText.includes(searchLower) ||
        Boolean(item.tip && item.tip.toLowerCase().includes(searchLower));
      return matchesCategory && matchesSearch;
    });
  }, [questions, activeCategory, searchQuery]);

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
          <h1 className="display-4 fw-bold mb-3">{faqData.title}</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: 720 }}>
            {faqData.subtitle}
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
            {categories.map((cat) => (
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
                      <span
                        className="rounded-circle bg-primary-light text-primary d-inline-flex align-items-center justify-content-center me-3 flex-shrink-0"
                        style={{ width: 40, height: 40 }}
                      >
                        <i className={`bi ${faq.icon} fs-5`}></i>
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <i className="bi bi-chevron-down faq-chevron text-muted fs-5 ms-2 flex-shrink-0"></i>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-content">
                      <hr className="my-2 opacity-10" />
                      <div
                        className="faq-markdown-body"
                        dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                      />
                      {faq.tip && (
                        <div className="p-3 rounded bg-primary-light border border-primary border-opacity-25 mt-3">
                          <div className="d-flex align-items-start">
                            <i className="bi bi-lightbulb-fill text-primary fs-5 me-2 mt-n1"></i>
                            <div>
                              <strong>Tip:</strong> {faq.tip}
                            </div>
                          </div>
                        </div>
                      )}
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
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 64, height: 64 }}
              >
                <i className="bi bi-discord fs-2"></i>
              </div>
              <h3 className="fw-bold mb-2">Nenašli jste odpověď?</h3>
              <p className="lead mb-4 text-muted">
                Pokud máte jakékoliv další dotazy, neváhejte se zeptat v kanálu{" "}
                <strong>#dotazy</strong> na našem Discordu!
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

export const Head = () => (
  <SEO title="Často kladené otázky | Debatní spolek Debatního deníku" />
);

export const query = graphql`
  query FaqPage {
    faqYaml {
      title
      subtitle
      categories {
        id
        label
        icon
      }
      questions {
        id
        category
        icon
        question
        answer {
          html
        }
        tip
      }
    }
  }
`;
