import React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <article className="py-4" style={{ maxWidth: 720 }}>
        <h1 className="mb-4">Zásady ochrany osobních údajů – DebTime</h1>

        <p className="text-muted mb-4">
          <small>Poslední aktualizace: 29.&nbsp;9.&nbsp;2026</small>
        </p>

        <p>
          Aplikace DebTime, vyvíjená Debatním spolkem Debatního deníku,
          nesbírá, neukládá ani nesdílí žádné osobní údaje uživatelů.
        </p>

        <p>
          Aplikace nevyžaduje přihlášení, nepoužívá analytické nástroje,
          nezobrazuje reklamy a nepřistupuje k internetu za účelem odesílání
          jakýchkoli dat.
        </p>

        <p>
          Veškerá data (např.&nbsp;nastavení časovače) zůstávají uložena pouze
          lokálně v&nbsp;zařízení uživatele.
        </p>

        <p>
          V&nbsp;případě dotazů nás kontaktujte na:{" "}
          <a href="mailto:it-admin@debatnispolek.debatnidenik.cz">
            it-admin@debatnispolek.debatnidenik.cz
          </a>
        </p>
      </article>
    </Layout>
  );
}

export const Head = () => (
  <SEO
    title="Zásady ochrany osobních údajů – DebTime"
    description="Zásady ochrany osobních údajů pro aplikaci DebTime. Aplikace nesbírá, neukládá ani nesdílí žádné osobní údaje."
    pathname="/privacy-policy/"
  />
);
