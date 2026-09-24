const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function stripHtml(text) {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function stripFrontmatter(content) {
  if (!content) return "";
  return content.replace(/^---[\s\S]*?---\s*/, "").trim();
}

function safeLoadYaml(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  const sanitized = content.replace(/!markdown\s*/g, "");
  return yaml.load(sanitized);
}

/**
 * Vygeneruje soubor chatbot-context.json pro Cloudflare Worker a Gemini.
 * Zahrnuje pouze veřejná data vhodná pro návštěvníky webu (kluby, FAQ, členství, turnaje, kontakty, TEA).
 * Nezahrnuje žádné privátní klíče, interní konfigurace ani citlivé osobní údaje.
 */
async function generateChatbotContext({ graphql, reporter } = {}) {
  const log = (msg) => {
    if (reporter && reporter.info) {
      reporter.info(`[chatbot-context] ${msg}`);
    } else {
      console.log(`[chatbot-context] ${msg}`);
    }
  };

  log("Generuji kontext webu pro AI chatbota...");

  const rootDir = path.resolve(__dirname);
  const contentDir = path.join(rootDir, "src", "content");

  let siteData = {
    name: "Debatní spolek Debatního deníku",
    url: "https://debatnispolek.debatnidenik.cz",
    discord: "https://discord.gg/qpp8v52AgP",
    description:
      "Neziskový spolek podporující rozvoj debatování, kritického myšlení, rétoriky a argumentace v České republice. Zastřešuje otevřené debatní kluby (Praha na ČVUT FIT, Plzeň na ZČU, Domažlice, Online na Discordu), pořádá turnaje (Debatní Mayhem, Plzeň Open) a workshopy pro začátečníky i pokročilé.",
  };

  const sections = [];

  // Zkusíme načíst data přes GraphQL, pokud je k dispozici
  let gqlData = null;
  if (typeof graphql === "function") {
    try {
      const res = await graphql(`
        query ChatbotContextGraphQL {
          faqYaml {
            questions {
              question
              answer {
                html
              }
              tip
            }
          }
          allClubsClubsYaml {
            nodes {
              name
              city
              path
              status {
                label
                note
              }
              meeting {
                fullWhen
              }
              location {
                name
                address
                room
              }
              owners {
                name
                role
                email
                discord
              }
            }
          }
          membershipYaml {
            whoCanJoin {
              lead
              items {
                title
                text
              }
            }
            rights {
              lead
              items {
                title
                text
              }
            }
            fees {
              monthly {
                amount
                note
              }
              yearly {
                amount
                note
              }
              voluntaryNote
            }
            paymentInfo {
              accountNumber
              ksMonthly
              ksYearly
              vsNote
            }
            howToJoin {
              lead
              formFolderUrl
              steps {
                stepNumber
                title
                text
                options {
                  title
                  desc
                }
              }
            }
          }
          contactsYaml {
            identification {
              name
              address
              ico
              vatNote
            }
            contactInfo {
              email
              phone
              discord
              address
            }
            committee {
              name
              role
              region
              bio
              email
              discord
              phone
            }
          }
          equityYaml {
            hero {
              lead
            }
            intro {
              items {
                title
                text
              }
            }
            contactMethods {
              items {
                title
                text
                buttonHref
              }
            }
          }
          allMarkdownRemark {
            nodes {
              frontmatter {
                title
                path
                template
              }
              rawMarkdownBody
            }
          }
        }
      `);
      if (res && res.data) {
        gqlData = res.data;
        log("Úspěšně načtena data přes Gatsby GraphQL schema.");
      }
    } catch (err) {
      log(`GraphQL dotaz se nezdařil (${err.message}), přecházím na přímé čtení souborů.`);
    }
  }

  // 1. FAQ (Často kladené otázky)
  let faqText = "# Často kladené otázky (FAQ)\n\n";
  if (gqlData && gqlData.faqYaml && gqlData.faqYaml.questions) {
    gqlData.faqYaml.questions.forEach((q) => {
      faqText += `### Otázka: ${q.question}\n`;
      faqText += `Odpověď: ${stripHtml(q.answer?.html || "")}\n`;
      if (q.tip) faqText += `Tip: ${q.tip}\n`;
      faqText += "\n";
    });
  } else {
    const faqFile = path.join(contentDir, "faq", "faq.yml");
    const faqData = safeLoadYaml(faqFile);
    if (faqData && faqData.questions) {
      faqData.questions.forEach((q) => {
        const ans = typeof q.answer === "string" ? q.answer : (q.answer?.content || JSON.stringify(q.answer));
        faqText += `### Otázka: ${q.question}\n`;
        faqText += `Odpověď: ${stripHtml(ans)}\n`;
        if (q.tip) faqText += `Tip: ${q.tip}\n`;
        faqText += "\n";
      });
    }
  }

  sections.push({
    id: "faq",
    title: "Často kladené otázky (FAQ)",
    url: "/faq",
    summary:
      "Informace o první návštěvě (zdarma, není třeba zkušeností ani talentu), pravidlech debaty, věkové neomezenosti, dobrovolném členství.",
    content: faqText.trim(),
  });

  // 2. Kluby a schůzky
  let clubsText = "# Debatní kluby a pravidelná setkání\n\n";
  const clubsFromGql = gqlData?.allClubsClubsYaml?.nodes;
  if (clubsFromGql && clubsFromGql.length > 0) {
    clubsFromGql.forEach((club) => {
      clubsText += `## ${club.name} (${club.city})\n`;
      clubsText += `- Odkaz: ${club.path}\n`;
      clubsText += `- Kdy: ${club.meeting?.fullWhen || "Neuvedeno"}\n`;
      clubsText += `- Kde: ${club.location?.name}, ${club.location?.address} (${club.location?.room || ""})\n`;
      clubsText += `- Status: ${club.status?.label || "Běžný provoz"} (${club.status?.note || ""})\n`;
      if (club.owners && club.owners.length > 0) {
        const orgs = club.owners
          .map((o) => `${o.name} (${o.role || "organizátor"}, email: ${o.email || "-"})`)
          .join("; ");
        clubsText += `- Organizátoři: ${orgs}\n`;
      }
      clubsText += "\n";
    });
  } else {
    const clubsFile = path.join(contentDir, "clubs", "clubs.yml");
    const clubsData = safeLoadYaml(clubsFile);
    if (Array.isArray(clubsData)) {
      clubsData.forEach((club) => {
        clubsText += `## ${club.name} (${club.city})\n`;
        clubsText += `- Odkaz: ${club.path}\n`;
        clubsText += `- Kdy: ${club.meeting?.fullWhen || club.meeting?.day + " " + club.meeting?.time}\n`;
        clubsText += `- Kde: ${club.location?.name}, ${club.location?.address} (${club.location?.room || ""})\n`;
        clubsText += `- Status: ${club.status?.label || "Běžný provoz"} (${club.status?.note || ""})\n`;
        if (club.owners && Array.isArray(club.owners)) {
          const orgs = club.owners
            .map((o) => `${o.name} (${o.role || "organizátor"}, email: ${o.email || "-"})`)
            .join("; ");
          clubsText += `- Organizátoři: ${orgs}\n`;
        }
        clubsText += "\n";
      });
    }
  }

  // Doplňující detaily ke klubům z markdown souborů
  const clubMds = [
    { file: "PragueClub.md", title: "Pražský klub (ČVUT FIT, Thákurova 2700/9, pondělí 18:00)" },
    { file: "PilsenClub.md", title: "Plzeňský klub (ZČU, Jungmannova 153/1, úterý 18:00)" },
    { file: "DomazliceClub.md", title: "Domažlický klub (SZŠ Chodské náměstí 97, středa 16:30)" },
    { file: "OnlineClub.md", title: "Online klub (Discord, čtvrtek 19:00)" },
    { file: "StartYourOwnClub.md", title: "Založení vlastního klubu pod spolkem" },
  ];

  clubMds.forEach(({ file, title }) => {
    const filePath = path.join(contentDir, "clubs", file);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const cleaned = stripHtml(stripFrontmatter(raw));
      clubsText += `### Podrobnosti: ${title}\n${cleaned.slice(0, 1400)}\n\n`;
    }
  });

  sections.push({
    id: "clubs",
    title: "Debatní kluby a schůzky",
    url: "/#pobocky",
    summary:
      "Praha (ČVUT pondělí 18:00), Plzeň (ZČU úterý 18:00), Domažlice (středa 16:30), Online (Discord čtvrtek 19:00).",
    content: clubsText.trim(),
  });

  // 3. Členství ve spolku
  let memText = "# Členství ve spolku Debatního deníku\n\n";
  const memGql = gqlData?.membershipYaml;
  const memData = memGql || safeLoadYaml(path.join(contentDir, "membership", "membership.yml"));

  if (memData) {
    memText += `## Kdo se může stát členem\n${memData.whoCanJoin?.lead || ""}\n`;
    if (memData.whoCanJoin?.items) {
      memData.whoCanJoin.items.forEach((it) => {
        memText += `- ${it.title}: ${it.text}\n`;
      });
    }

    memText += `\n## Práva a výhody člena\n${memData.rights?.lead || ""}\n`;
    if (memData.rights?.items) {
      memData.rights.items.forEach((it) => {
        memText += `- ${it.title}: ${it.text}\n`;
      });
    }

    memText += `\n## Členské příspěvky a platba\n`;
    memText += `- Měsíční příspěvek: ${memData.fees?.monthly?.amount || "od 100 Kč"} (konstantní symbol: ${memData.paymentInfo?.ksMonthly || "100"})\n`;
    memText += `- Roční příspěvek: ${memData.fees?.yearly?.amount || "od 1 000 Kč"} (konstantní symbol: ${memData.paymentInfo?.ksYearly || "1000"})\n`;
    memText += `- Číslo účtu: ${memData.paymentInfo?.accountNumber || "107-3876090227/0100"}\n`;
    memText += `- Variabilní symbol: ${memData.paymentInfo?.vsNote || "Vlastní VS přidělený po schválení přihlášky"}\n`;
    if (memData.fees?.voluntaryNote) memText += `- Poznámka: ${memData.fees.voluntaryNote}\n`;

    memText += `\n## Jak se stát členem (postup)\n${memData.howToJoin?.lead || ""}\n`;
    if (memData.howToJoin?.steps) {
      memData.howToJoin.steps.forEach((st) => {
        memText += `${st.stepNumber}. ${st.title}: ${st.text}\n`;
        if (st.options) {
          st.options.forEach((opt) => {
            memText += `   * ${opt.title}: ${opt.desc}\n`;
          });
        }
      });
    }
    if (memData.howToJoin?.formFolderUrl) {
      memText += `Formulář přihlášky na SharePointu: ${memData.howToJoin.formFolderUrl}\n`;
    }
  }

  sections.push({
    id: "membership",
    title: "Členství ve spolku",
    url: "/membership",
    summary:
      "Vznik členství podáním přihlášky (fyzicky, Czech POINT, kvalifikovaný e-podpis), příspěvky od 100 Kč/měsíc na účet 107-3876090227/0100.",
    content: memText.trim(),
  });

  // 4. Turnaje a formát debat
  let tourText = "# Debatní turnaje a formát debat\n\n";
  const tourFile = path.join(contentDir, "tournaments", "Tournaments.md");
  if (fs.existsSync(tourFile)) {
    const raw = fs.readFileSync(tourFile, "utf8");
    tourText += stripHtml(stripFrontmatter(raw));
  } else {
    tourText += "Spolek pořádá turnaje Debatní Mayhem (formát All Random All Mid) a Plzeň Open (britský parlamentní formát).";
  }

  sections.push({
    id: "tournaments",
    title: "Debatní turnaje",
    url: "/turnaje",
    summary: "Informace o turnajích Debatní Mayhem a Plzeň Open a pravidlech britské parlamentní debaty.",
    content: tourText.trim(),
  });

  // 5. Kontakty a výbor spolku
  let contText = "# Kontakty a vedení spolku\n\n";
  const contGql = gqlData?.contactsYaml;
  const contData = contGql || safeLoadYaml(path.join(contentDir, "contacts", "contacts.yml"));

  if (contData) {
    contText += `## Základní identifikační a kontaktní údaje\n`;
    contText += `- Název: ${contData.identification?.name || "Debatní spolek Debatního deníku"}\n`;
    contText += `- IČO: ${contData.identification?.ico || "21653968"} (${contData.identification?.vatNote || "Neplátce DPH"})\n`;
    contText += `- Sídlo: ${contData.identification?.address || contData.contactInfo?.address || "Zdíkovská 3322/66h, Smíchov, 150 00 Praha 5"}\n`;
    contText += `- Oficiální email: ${contData.contactInfo?.email || "vybor@debatnispolek.debatnidenik.cz"}\n`;
    contText += `- Telefon: ${contData.contactInfo?.phone || "+420 705 916 285"}\n`;
    contText += `- Discord server: ${contData.contactInfo?.discord || "https://discord.gg/qpp8v52AgP"}\n\n`;

    contText += `## Debatní výbor a vedení\n`;
    if (contData.committee && Array.isArray(contData.committee)) {
      contData.committee.forEach((m) => {
        contText += `### ${m.name} – ${m.role}\n`;
        if (m.region) contText += `- Působnost: ${m.region}\n`;
        if (m.bio) contText += `- Osobní profil: ${m.bio}\n`;
        contText += `- Email: ${m.email || "-"}\n`;
        contText += `- Discord: ${m.discord || "-"}\n`;
        if (m.phone) contText += `- Telefon: ${m.phone}\n`;
        contText += "\n";
      });
    }
  }

  sections.push({
    id: "contacts",
    title: "Kontakty a vedení spolku",
    url: "/contacts",
    summary:
      "IČO 21653968, email vybor@debatnispolek.debatnidenik.cz, tel. +420 705 916 285, Discord, Jakub Šmejkal (předseda), Matěj Diviš, Tadeáš Souba.",
    content: contText.trim(),
  });

  // 6. Equity – Tým pro Empatii a Asistenci (TEA)
  let eqText = "# Equity – Tým pro Empatii a Asistenci (TEA)\n\n";
  const eqGql = gqlData?.equityYaml;
  const eqData = eqGql || safeLoadYaml(path.join(contentDir, "equity", "equity.yml"));

  if (eqData) {
    eqText += `${eqData.hero?.lead || ""}\n\n`;
    eqText += `## Poslání TEA týmu\n`;
    if (eqData.intro?.items) {
      eqData.intro.items.forEach((it) => {
        eqText += `- ${it.title}: ${it.text}\n`;
      });
    }
    eqText += `\nTEA tým dohlíží na bezpečné, respektující a férové prostředí na klubech i turnajích. K dispozici je anonymní kontaktní formulář na webu v sekci /equity nebo možnost obrátit se na členy osobně či na Discordu.\n`;
  }

  sections.push({
    id: "equity",
    title: "Equity (TEA) – Bezpečné prostředí",
    url: "/equity",
    summary: "Podpora, naslouchání a řešení podnětů pro bezpečné a respektující prostředí na všech akcích.",
    content: eqText.trim(),
  });

  // 7. Podpora spolku a dary
  const supFile = path.join(contentDir, "SupportUs.md");
  let supText = "# Podpora spolku a dary\n\n";
  if (fs.existsSync(supFile)) {
    const raw = fs.readFileSync(supFile, "utf8");
    supText += `Číslo účtu pro dary: 7657540003/5500\nZpráva pro příjemce: Vaše jméno\nIČO: 21653968\n\n`;
    supText += stripHtml(stripFrontmatter(raw)).slice(0, 1500);
  }

  sections.push({
    id: "support",
    title: "Podpora a dary",
    url: "/podporte-nas",
    summary: "Číslo účtu pro dary: 7657540003/5500, potvrzení o daru pro daňový odpočet.",
    content: supText.trim(),
  });

  // 8. Akce a kalendář
  sections.push({
    id: "events",
    title: "Kalendář akcí",
    url: "/akce",
    summary:
      "Kalendář slouží pro akce mimo běžný provoz klubů (turnaje, workshopy, volnočasové aktivity). Možnost odběru do Google Kalendáře / iCal.",
    content:
      "# Kalendář akcí\n\nKalendář na stránce /akce slouží pro přehled událostí mimo běžné schůzky klubů. Zahrnuje turnaje, mimořádné workshopy a komunitní akce. Akce lze odebírat do vlastního Google kalendáře, Apple kalendáře i Outlooku. Přihlašování probíhá přes Discord nebo formuláře.",
  });

  // Sestavení celkového textu (kontextu pro LLM)
  const fullText = sections
    .map(
      (sec) =>
        `==================================================\nSEKCE: ${sec.title} (URL: ${sec.url})\n==================================================\n${sec.content}\n`
    )
    .join("\n\n");

  const contextData = {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    site: siteData,
    sections: sections.map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      summary: s.summary,
      content: s.content,
    })),
    contextText: fullText,
  };

  // Uložení do public/chatbot-context.json
  const publicDir = path.join(rootDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPath = path.join(publicDir, "chatbot-context.json");
  fs.writeFileSync(publicPath, JSON.stringify(contextData, null, 2), "utf8");

  // Uložení do static/chatbot-context.json (aby fungovalo i v gatsby develop a bylo zahrnuto v gatsby build)
  const staticDir = path.join(rootDir, "static");
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }
  const staticPath = path.join(staticDir, "chatbot-context.json");
  fs.writeFileSync(staticPath, JSON.stringify(contextData, null, 2), "utf8");

  // Uložení také do cloudflare-worker/knowledge.json pro lokální vývoj workeru
  const workerDir = path.join(rootDir, "cloudflare-worker");
  if (fs.existsSync(workerDir)) {
    fs.writeFileSync(
      path.join(workerDir, "knowledge.json"),
      JSON.stringify(contextData, null, 2),
      "utf8"
    );
  }

  const sizeKb = (fs.statSync(publicPath).size / 1024).toFixed(1);
  log(`Hotovo! Uloženo do ${publicPath} a ${staticPath} (${sizeKb} KB, ${sections.length} sekcí).`);

  return contextData;
}

if (require.main === module) {
  generateChatbotContext();
}

module.exports = { generateChatbotContext };
