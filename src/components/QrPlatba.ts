/**
 * QR Platba generátor jako nativní Custom Element, ne React komponenta.
 *
 * Proč ne React: stránka /podporte-nas se buildí z Markdownu přes
 * gatsby-transformer-remark, výsledný HTML string se renderuje přes
 * dangerouslySetInnerHTML v Generic.tsx. React do takto vloženého HTML
 * neattachuje event handlery — React komponenta vepsaná do markdownu by byla
 * mrtvá. Cesta přes MDX (gatsby-plugin-mdx) by fungovala, ale znamenala by
 * přidání pluginu, úpravu gatsby-node.ts a migraci .md → .mdx. To je pro
 * jeden interaktivní prvek overkill.
 *
 * Web Components naopak fungují nezávisle na frameworku: jakmile browser
 * potká customElements.define(), upgradne všechny existující <qr-platba>
 * tagy v DOM a sám zařídí lifecycle (connectedCallback). Editor v markdownu
 * zapíše <qr-platba ...></qr-platba>, my komponentu jednou registrujeme v
 * gatsby-browser.js, a šlape v markdownu i kdekoli jinde.
 *
 * QR kód se vykresluje klientsky (qr-code-styling) z ručně sestaveného
 * SPAYD payloadu — díky tomu můžeme řídit barvy, tvar puntíků i logo
 * uprostřed. Dřívější varianta přes paylibo.com vracela hotový PNG bez
 * možnosti stylizace.
 */

import QRCodeStyling, { type Options } from "qr-code-styling";

const PRIMARY = "#39aae1";
const SECONDARY = "#ee2b2d";

const QR_OPTIONS: Options = {
  width: 220,
  height: 220,
  type: "svg",
  image: "/favicon.svg",
  margin: 4,
  qrOptions: {
    errorCorrectionLevel: "H",
  },
  dotsOptions: {
    type: "rounded",
    color: PRIMARY,
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: PRIMARY,
  },
  cornersDotOptions: {
    type: "dot",
    color: SECONDARY,
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 6,
    imageSize: 0.32,
    hideBackgroundDots: true,
  },
};

// Doba klidu po posledním stisku, kdy přemalujeme QR. qr-code-styling
// při každém update() znovu staví SVG včetně embedded loga, takže rychlé
// psaní bez debounce trhá UI.
const REFRESH_DEBOUNCE_MS = 250;

class QrPlatba extends HTMLElement {
  private amount = "";
  private message = "";
  private fallbackMessage = "";
  private iban = "";
  private qr: QRCodeStyling | null = null;
  private refreshTimer: number | null = null;

  connectedCallback() {
    if (this.dataset.initialized === "true") return;
    this.dataset.initialized = "true";

    const account = this.getAttribute("account") ?? "";
    const bank = this.getAttribute("bank") ?? "";
    this.fallbackMessage = this.getAttribute("default-message") ?? "";
    this.iban = czAccountToIban(account, bank);

    this.innerHTML = `
      <div class="row g-3 align-items-center">
        <div class="col-md-7">
          <div class="mb-3" style="max-width: 240px;">
            <label class="form-label small fw-semibold mb-1">Částka</label>
            <div class="input-group">
              <input class="form-control qr-platba-amount" type="number" min="0" step="1" inputmode="numeric" placeholder="100" />
              <span class="input-group-text">Kč</span>
            </div>
          </div>
          <div style="max-width: 240px;">
            <label class="form-label small fw-semibold mb-1">Vaše jméno</label>
            <input class="form-control qr-platba-message" type="text" placeholder="Jan Novák" />
            <div class="form-text small">Abychom dokázali vaši platbu identifikovat a vystavit vám potvrzení o daru.</div>
          </div>
        </div>
        <div class="col-md-5 text-center text-md-start">
          <div class="qr-platba-canvas d-inline-block bg-white p-2 rounded shadow-sm" style="line-height: 0;"></div>
          <p class="small text-muted mt-2 mb-0">Naskenujte v bankovní aplikaci</p>
        </div>
      </div>
    `;

    const canvas = this.querySelector<HTMLDivElement>(".qr-platba-canvas");
    const amountInput =
      this.querySelector<HTMLInputElement>(".qr-platba-amount");
    const messageInput =
      this.querySelector<HTMLInputElement>(".qr-platba-message");

    if (canvas) {
      this.qr = new QRCodeStyling({ ...QR_OPTIONS, data: this.buildSpayd() });
      this.qr.append(canvas);
    }

    amountInput?.addEventListener("input", (e) => {
      this.amount = (e.target as HTMLInputElement).value;
      this.refresh();
    });
    messageInput?.addEventListener("input", (e) => {
      this.message = (e.target as HTMLInputElement).value;
      this.refresh();
    });
  }

  private refresh() {
    if (this.refreshTimer !== null) {
      window.clearTimeout(this.refreshTimer);
    }
    this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = null;
      this.qr?.update({ data: this.buildSpayd() });
    }, REFRESH_DEBOUNCE_MS);
  }

  disconnectedCallback() {
    if (this.refreshTimer !== null) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private buildSpayd(): string {
    const fields = [`ACC:${this.iban}`, "CC:CZK"];
    if (this.amount) {
      const n = Number(this.amount);
      if (Number.isFinite(n) && n > 0) fields.push(`AM:${n.toFixed(2)}`);
    }
    const messageForQr = this.message || this.fallbackMessage;
    if (messageForQr) fields.push(`MSG:${sanitizeSpaydText(messageForQr)}`);
    return `SPD*1.0*${fields.join("*")}`;
  }
}

/**
 * Převod českého čísla účtu (volitelný prefix-číslo/banka) na IBAN.
 * Algoritmus dle ISO 13616: BBAN + "CZ" + "00" → mod 97 → 98 − mod.
 * Velké číslo počítáme inkrementálně po číslicích, abychom se vyhnuli
 * BigInt/přetečení.
 */
function czAccountToIban(account: string, bank: string): string {
  let prefix = "0";
  let number = account;
  if (account.includes("-")) {
    const parts = account.split("-");
    prefix = parts[0];
    number = parts[1];
  }

  const bban =
    bank.padStart(4, "0") + prefix.padStart(6, "0") + number.padStart(10, "0");

  // SPAYD/ACC neobsahuje mezery, "CZ" → "1235", check init "00"
  const checkSource = bban + "123500";
  let mod = 0;
  for (const ch of checkSource) {
    mod = (mod * 10 + Number(ch)) % 97;
  }
  const check = (98 - mod).toString().padStart(2, "0");
  return `CZ${check}${bban}`;
}

/**
 * SPAYD payload je oddělen `*`, takže ho ve volných textech nesmíme nechat.
 * Diakritika a další ne-ASCII znaky se podle specifikace SPAYD musí
 * percent-encodovat (UTF-8) — bankovní appky, které decodují podle spec,
 * jinak místo `ž` zobrazí `~`.
 */
function sanitizeSpaydText(s: string): string {
  return encodeURIComponent(s.replace(/\*/g, " ").trim());
}

if (typeof window !== "undefined" && !customElements.get("qr-platba")) {
  customElements.define("qr-platba", QrPlatba);
}

export {};
