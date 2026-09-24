import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";

const WORKER_URL = "https://debatni-chatbot.smejkal.workers.dev/";

const SUGGESTED_QUESTIONS = [
  "Jak se můžu stát členem?",
  "Kdy máte schůzky?",
  "Jak fungují turnaje?",
  "Je klub vhodný pro začátečníky?",
];

const INITIAL_MESSAGE = {
  id: "welcome",
  sender: "bot",
  text: "Dobrý den! Jsem virtuální asistent Debatního spolku Debatního deníku. Rád vám odpovím na otázky týkající se schůzek, členství, turnajů nebo debatování.",
  timestamp: new Date(),
};

/**
 * Bezpečně formátuje text odpovědi (tučné písmo, odrážky a klikatelné odkazy).
 */
function renderFormattedMessage(text) {
  if (!text) return null;
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
    const content = isBullet ? line.trim().substring(2) : line;

    const parts = [];
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("[") && token.includes("](")) {
        const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          const isExternal = /^https?:\/\//.test(linkUrl);
          parts.push(
            <a
              key={`${lineIdx}-${match.index}`}
              href={linkUrl}
              className="chatbot-link"
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {linkText}
            </a>
          );
        } else {
          parts.push(token);
        }
      } else if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={`${lineIdx}-${match.index}`}>
            {token.slice(2, -2)}
          </strong>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    if (isBullet) {
      return (
        <div key={lineIdx} style={{ display: "flex", gap: "6px", marginTop: "2px", marginBottom: "2px" }}>
          <span style={{ color: "#39aae1", fontWeight: "bold" }}>•</span>
          <div>{parts}</div>
        </div>
      );
    }

    if (!line.trim()) {
      return <div key={lineIdx} style={{ height: "6px" }} />;
    }

    return <div key={lineIdx}>{parts}</div>;
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Automatické rolování na konec
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isLoading]);

  // Focus na input po otevření
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isLoading]);

  // Zavření na klávesu Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (questionText) => {
    const q = (questionText !== undefined ? questionText : input).trim();
    if (!q || isLoading) return;

    if (q.length > 500) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "Otázka je příliš dlouhá. Zkraťte ji prosím na maximálně 500 znaků.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
      return;
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: q,
          website: honeypot || "", // Honeypot pole proti spambotům
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const answer =
          data.answer ||
          data.reply ||
          "Omlouvám se, na tento dotaz se mi nepodařilo najít odpověď.";

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: answer,
            timestamp: new Date(),
          },
        ]);
      } else {
        let errorMsg = "Omlouváme se, služba asistenta je dočasně nedostupná.";
        if (response.status === 400) {
          errorMsg = "Otázka byla prázdná nebo příliš dlouhá (maximum je 500 znaků).";
        } else if (response.status === 429) {
          errorMsg = "Příliš mnoho dotazů. Počkejte prosím chvíli a zkuste to znovu.";
        } else if (response.status === 502 || response.status === 503) {
          errorMsg =
            "AI asistent je momentálně nedostupný. Zkuste to prosím za chvíli nebo využijte náš Discord či kontakty.";
        }

        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch {
          // Použije se výchozí srozumitelná hláška
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            sender: "bot",
            text: errorMsg,
            timestamp: new Date(),
            isError: true,
          },
        ]);
      }
    } catch (err) {
      console.error("Chyba při komunikaci s Workerem:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "bot",
          text: "Nepodařilo se připojit k asistentovi. Zkontrolujte připojení k internetu a zkuste to znovu.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Konverzace byla vyčištěna. Na co dalšího se chcete zeptat?",
        timestamp: new Date(),
      },
    ]);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="chatbot-root">
      {/* Plovoucí tlačítko v pravém dolním rohu */}
      <button
        type="button"
        className={`chatbot-launcher ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Zavřít chatovací okno" : "Otevřít chat s asistentem"}
        aria-expanded={isOpen}
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-chat-dots-fill"}`}></i>
      </button>

      {/* Chatovací okno */}
      {isOpen && (
        <div
          className="chatbot-window"
          role="dialog"
          aria-labelledby="chatbot-heading"
        >
          {/* Hlavička okna */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-header-avatar">
                <i className="bi bi-robot"></i>
              </div>
              <div>
                <h6 className="chatbot-title" id="chatbot-heading">
                  Debatní asistent
                </h6>
                <div className="chatbot-status-row">
                  <span className="chatbot-status-dot"></span>
                  <span>Odpovídá podle webu</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "4px" }}>
              <button
                type="button"
                className="chatbot-header-btn"
                onClick={handleReset}
                title="Začít novou konverzaci"
                aria-label="Začít novou konverzaci"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                onClick={() => setIsOpen(false)}
                title="Zavřít chat"
                aria-label="Zavřít chat"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Tělo zpráv */}
          <div className="chatbot-body">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`chatbot-msg-row ${isUser ? "user" : "bot"}`}
                >
                  {!isUser && (
                    <div className="chatbot-bot-avatar" aria-hidden="true">
                      <i className="bi bi-robot"></i>
                    </div>
                  )}
                  <div
                    className={`chatbot-bubble ${
                      isUser
                        ? "user"
                        : msg.isError
                        ? "error"
                        : "bot"
                    }`}
                  >
                    <div className="chatbot-bubble-content">
                      {renderFormattedMessage(msg.text)}
                    </div>
                    <div className="chatbot-bubble-time">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Rychlé návrhy dotazů */}
            {showSuggestions && (
              <div className="chatbot-suggestions">
                <div className="chatbot-suggestions-title">Rychlé dotazy:</div>
                <div className="chatbot-chip-list">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chatbot-chip"
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Indikátor načítání */}
            {isLoading && (
              <div className="chatbot-msg-row bot">
                <div className="chatbot-bot-avatar" aria-hidden="true">
                  <i className="bi bi-robot"></i>
                </div>
                <div className="chatbot-bubble bot chatbot-typing">
                  <span className="chatbot-typing-dot"></span>
                  <span className="chatbot-typing-dot"></span>
                  <span className="chatbot-typing-dot"></span>
                  <small style={{ color: "#6c757d", marginLeft: "6px" }}>
                    Hledám na webu...
                  </small>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Spodní formulář */}
          <div className="chatbot-footer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              {/* Skryté honeypot pole pro boty */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="chatbot-honeypot"
                aria-hidden="true"
              />

              <div className="chatbot-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  className="chatbot-input"
                  placeholder="Zeptejte se na cokoliv o spolku..."
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  disabled={isLoading}
                  maxLength={500}
                  aria-label="Otázka pro asistenta"
                />
                <button
                  type="submit"
                  className="chatbot-send-btn"
                  disabled={!input.trim() || isLoading}
                  aria-label="Odeslat dotaz"
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </form>
            <div className="chatbot-disclaimer">
              Odpovědi jsou čerpány z veřejného obsahu tohoto webu.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
