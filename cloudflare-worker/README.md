# Cloudflare Worker – AI Chatbot pro Debatní spolek Debatního deníku

Tento Worker slouží jako bezpečný backend pro webového chatbota. Zabezpečuje volání Google Gemini API, hlídá limity Free Tieru a zajišťuje, že se `GEMINI_API_KEY` nikdy nedostane do prohlížeče návštěvníka.

---

## 🚀 Způsob 1: Nasazení přes Cloudflare Dashboard (V prohlížeči, bez instalace)

1. Přihlaste se do [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. V levém menu klikněte na **Workers & Pages** → **Create application** → **Create Worker**.
3. Zvolte název (např. `dsdd-chatbot`) a klikněte na **Deploy**.
4. Klikněte na **Edit code** a vložte kód:
   - Zkopírujte obsah `cloudflare-worker/src/index.ts`, `rateLimiter.ts` a `prompt.ts` (nebo použijte předem sestavený bundle).
   - Klikněte na **Save and Deploy**.
5. V nastavení Workeru: **Settings** → **Variables and Secrets**:
   - V sekci **Secrets** klikněte na **Add**.
   - Název (Variable name): `GEMINI_API_KEY`
   - Hodnota: Vložte váš klíč z [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Klikněte na **Save and deploy**.
6. Zkopírujte URL adresu vašeho workeru (např. `https://dsdd-chatbot.<vase-jmeno>.workers.dev`).

---

## 💻 Způsob 2: Nasazení přes terminál (Wrangler CLI)

1. V adresáři projektu přejděte do složky workeru:
   ```bash
   cd cloudflare-worker
   ```
2. Přihlaste se do Cloudflare (pokud ještě nejste přihlášeni):
   ```bash
   npx wrangler login
   ```
3. Uložte API klíč jako Secret (nikdy se neukládá do git repozitáře):
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```
   *Po vyzvání vložte váš Gemini API klíč.*

4. Nasaďte worker:
   ```bash
   npx wrangler deploy
   ```
5. Wrangler vám vypíše URL vašeho nasazeného workeru (např. `https://dsdd-chatbot.<vase-subdomena>.workers.dev`).

---

## 🔗 Propojení s Gatsby webem

V kořenovém adresáři Gatsby projektu vložte URL workeru do souborů `.env` a `.env.production`:

```env
GATSBY_CHATBOT_API_URL=https://dsdd-chatbot.<vase-subdomena>.workers.dev/api/chat
GATSBY_CHATBOT_ENABLED=true
```

Pokud chcete chatbot kdykoliv dočasně nebo trvale vypnout, stačí nastavit:
```env
GATSBY_CHATBOT_ENABLED=false
```

---

## 🛡️ Bezpečnostní prvky a limity Free Tieru

1. **Ochrana před poplatky:**
   - Worker používá výchozí model `gemini-2.0-flash` (nebo `gemini-1.5-flash`), který je v rámci **Free Tieru Google AI Studio zdarma** (až 15 požadavků za minutu a 1 500 požadavků za den).
   - Worker má vestavěný **in-memory rate limiter**:
     - Max. 5 požadavků / minutu na 1 návštěvníka (IP).
     - Max. 12 požadavků / minutu globálně (zajišťuje, že nikdy nepřekročíte limit 15 RPM).
2. **Ochrana vstupu:**
   - Maximální délka dotazu je omezena na 500 znaků.
   - Prázdné dotazy jsou odmítnuty před voláním API.
   - Systémový prompt obsahuje striktní instrukce proti prompt injection a úniku systémových pravidel.
3. **Aktualizace znalostí:**
   - Worker obsahuje přibalenou znalostní bázi `knowledge.json`.
   - Navíc se každou hodinu automaticky pokusí stáhnout nejnovější `chatbot-knowledge.json` přímo z vašeho nasazeného webu, takže při úpravě textů na webu není nutné Worker znovu nasazovat!
