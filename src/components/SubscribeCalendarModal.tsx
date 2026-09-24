import React, { useState } from "react";
import { getPublicCalendarSubscribeUrls } from "../utils/calendarExport";

interface SubscribeCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeCalendarModal: React.FC<SubscribeCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"apple" | "google" | "other">(
    "google"
  );

  if (!isOpen) return null;

  const urls = getPublicCalendarSubscribeUrls();
  if (!urls) {
    return (
      <>
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header px-4 py-3">
                <h5 className="modal-title fw-bold mb-0">Odebírat kalendář</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Zavřít"
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="bi bi-info-circle text-muted fs-2 d-block mb-2"></i>
                <p className="text-muted mb-0">
                  Odběr kalendáře není v tuto chvíli dostupný (chybí nastavení kalendáře).
                </p>
              </div>
              <div className="modal-footer bg-light border-0 px-4 py-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Zavřít
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" onClick={onClose} />
      </>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urls.iCal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is blocked
      const input = document.getElementById("calendar-feed-input") as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
            {/* Modal Header */}
            <div className="modal-header px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar2-check text-primary fs-4"></i>
                <div>
                  <h5 className="modal-title fw-bold mb-0">
                    Odebírat kalendář debat a akcí
                  </h5>
                  <small className="text-muted">
                    Automatická synchronizace přímo do vašeho mobilu a počítače
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Zavřít"
              ></button>
            </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            <p className="text-muted mb-4">
              Vyberte svou oblíbenou kalendářovou aplikaci. Všechny nové debatní schůzky, turnaje a workshopy se vám v ní automaticky aktualizují bez nutnosti ručního zadávání.
            </p>

            {/* Quick 1-Click Action Buttons */}
            <div className="row g-3 mb-4">
              {/* Google Calendar */}
              <div className="col-md-4">
                <a
                  href={urls.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary w-100 h-100 p-3 text-start d-flex flex-column justify-content-between rounded-3 border-2"
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-google fs-4 text-danger"></i>
                    <strong className="text-body">Google Kalendář</strong>
                  </div>
                  <small className="text-muted">
                    Přidá kalendář do vašeho Google účtu jedním kliknutím.
                  </small>
                </a>
              </div>

              {/* Apple Calendar (iPhone / iPad / Mac) */}
              <div className="col-md-4">
                <a
                  href={urls.webcal}
                  className="btn btn-outline-primary w-100 h-100 p-3 text-start d-flex flex-column justify-content-between rounded-3 border-2"
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-apple fs-4 text-dark"></i>
                    <strong className="text-body">Apple Kalendář</strong>
                  </div>
                  <small className="text-muted">
                    Otevře přímý odběr (webcal) v aplikaci Kalendář na iPhone či Macu.
                  </small>
                </a>
              </div>

              {/* Outlook / iCal */}
              <div className="col-md-4">
                <a
                  href={urls.iCal}
                  download="debatni-spolek.ics"
                  className="btn btn-outline-primary w-100 h-100 p-3 text-start d-flex flex-column justify-content-between rounded-3 border-2"
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-calendar-event fs-4 text-primary"></i>
                    <strong className="text-body">Outlook / iCal</strong>
                  </div>
                  <small className="text-muted">
                    Stáhne formát .ics pro Outlook nebo libovolnou jinou aplikaci.
                  </small>
                </a>
              </div>
            </div>

            {/* Direct Feed URL with Copy Button */}
            <div className="card p-3 bg-light border-0 rounded-3 mb-4">
              <label
                htmlFor="calendar-feed-input"
                className="form-label fw-bold text-body small mb-1 d-flex align-items-center gap-1"
              >
                <i className="bi bi-link-45deg text-primary"></i>
                Adresa iCal feedu (pro ruční vložení do aplikace):
              </label>
              <div className="input-group">
                <input
                  id="calendar-feed-input"
                  type="text"
                  readOnly
                  value={urls.iCal}
                  className="form-control font-monospace small bg-white"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  className={`btn ${
                    copied ? "btn-success" : "btn-primary"
                  } d-inline-flex align-items-center gap-1 px-3`}
                  onClick={handleCopy}
                >
                  <i
                    className={`bi ${copied ? "bi-check-lg" : "bi-clipboard"}`}
                  ></i>
                  <span>{copied ? "Zkopírováno!" : "Kopírovat"}</span>
                </button>
              </div>
            </div>

            {/* Instructions Accordion / Tabs */}
            <div className="border-top pt-3">
              <h6 className="fw-bold mb-2 small text-uppercase text-muted">
                Potřebujete poradit s nastavením?
              </h6>

              <ul className="nav nav-pills nav-fill gap-2 mb-3 small">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link py-1 px-3 ${
                      activeTab === "google"
                        ? "active"
                        : "bg-light text-secondary"
                    }`}
                    onClick={() => setActiveTab("google")}
                  >
                    <i className="bi bi-google me-1"></i> Google
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link py-1 px-3 ${
                      activeTab === "apple"
                        ? "active"
                        : "bg-light text-secondary"
                    }`}
                    onClick={() => setActiveTab("apple")}
                  >
                    <i className="bi bi-apple me-1"></i> iPhone / iPad
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link py-1 px-3 ${
                      activeTab === "other"
                        ? "active"
                        : "bg-light text-secondary"
                    }`}
                    onClick={() => setActiveTab("other")}
                  >
                    <i className="bi bi-windows me-1"></i> Outlook
                  </button>
                </li>
              </ul>

              <div className="small text-muted p-3 bg-light rounded-3">
                {activeTab === "google" && (
                  <ol className="mb-0 ps-3">
                    <li className="mb-1">
                      Klikněte na tlačítko <strong>Google Kalendář</strong> výše.
                    </li>
                    <li className="mb-1">
                      Pokud se kalendář automaticky nepřidá, v Google Kalendáři vlevo dole u <em>Jiné kalendáře</em> klikněte na <strong>+</strong> &gt; <strong>Pomocí adresy URL</strong>.
                    </li>
                    <li>Vložte zkopírovanou adresu iCal feedu a potvrďte.</li>
                  </ol>
                )}

                {activeTab === "apple" && (
                  <ol className="mb-0 ps-3">
                    <li className="mb-1">
                      Na iPhonu nebo iPadu klikněte na tlačítko <strong>Apple Kalendář</strong> výše – systém se vás zeptá, zda chcete kalendář odebírat.
                    </li>
                    <li className="mb-1">
                      Případně otevřete <em>Nastavení &gt; Kalendář &gt; Účty &gt; Přidat účet &gt; Jiný &gt; Přidat odebíraný kalendář</em>.
                    </li>
                    <li>Vložte zkopírovanou adresu iCal feedu a uložte.</li>
                  </ol>
                )}

                {activeTab === "other" && (
                  <ol className="mb-0 ps-3">
                    <li className="mb-1">
                      V aplikaci Outlook klikněte na ikonu <em>Kalendář</em> &gt; <em>Přidat kalendář</em>.
                    </li>
                    <li className="mb-1">
                      Zvolte možnost <strong>Přihlásit se k odběru z webu</strong>.
                    </li>
                    <li>Vložte zkopírovanou adresu feedu a klikněte na <em>Importovat</em>.</li>
                  </ol>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-light border-0 px-4 py-3">
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={onClose}
            >
              Zavřít
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show" onClick={onClose} />
  </>
  );
};

export default SubscribeCalendarModal;
