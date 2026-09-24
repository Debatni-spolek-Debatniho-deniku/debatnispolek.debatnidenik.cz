import React, { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import EventCard from "../components/EventCard";
import MonthlyCalendar from "../components/MonthlyCalendar";
import SubscribeCalendarModal from "../components/SubscribeCalendarModal";
import { CalendarEvent, EventType, EventClub } from "../types/calendar";
import { calendarService } from "../services/calendarService";

const heroTitle = "Kalendář akcí";
const heroLead =
  "Tento kalendář slouží pro akce mimo klasické fungování klubů – ať už jde o turnaje, další workshopy nebo jen volnočasové aktivity.";

const emptyTitle = "Momentálně nejsou naplánované žádné akce.";
const emptyText =
  "Nové termíny turnajů, workshopů a volnočasových aktivit brzy zveřejníme. V případě dotazů se můžete připojit na náš Discord server nebo nás kontaktovat.";
const emptyDiscordBtn = "Připojit se na Discord";
const emptyDiscordHref = "https://discord.gg/qpp8v52AgP";

const errorTitle = "Akce se momentálně nepodařilo načíst.";
const errorText = "Zkuste to prosím později.";
const retryBtnText = "Zkusit znovu";

export default function AkcePage() {
  // Data state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
    () => new Date()
  );
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoadingMonth, setIsLoadingMonth] = useState<boolean>(false);

  // UI state: Filtering & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");
  const [selectedClub, setSelectedClub] = useState<EventClub | "all">("all");
  const [mobileTab, setMobileTab] = useState<"list" | "calendar">("list");
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Check if calendar subscription is available from environment
  const hasCalendarConfig = Boolean(process.env.GATSBY_GOOGLE_CALENDAR_ID);

  // Initial load
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const now = new Date();
    const result = await calendarService.fetchInitialData(now);

    if (result.success) {
      setUpcomingEvents(result.upcomingEvents || []);
      setMonthEvents(result.events || []);
      setLoading(false);
    } else {
      setError(result.error || errorText);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle month change
  const handleMonthChange = useCallback(
    async (targetYear: number, targetMonthIndex: number) => {
      const targetDate = new Date(targetYear, targetMonthIndex, 1);
      setCurrentCalendarDate(targetDate);
      setIsLoadingMonth(true);

      const result = await calendarService.fetchMonth(
        targetYear,
        targetMonthIndex
      );

      if (result.success) {
        setMonthEvents(result.events || []);
      } else {
        console.error(
          `[Calendar] Nepodařilo se načíst měsíc ${targetYear}-${targetMonthIndex + 1}`
        );
      }
      setIsLoadingMonth(false);
    },
    []
  );

  const handleManualRetry = () => {
    calendarService.resetCircuitBreaker();
    loadInitialData();
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEventId(event.id);
    if (
      event.start.getFullYear() !== currentCalendarDate.getFullYear() ||
      event.start.getMonth() !== currentCalendarDate.getMonth()
    ) {
      handleMonthChange(event.start.getFullYear(), event.start.getMonth());
    }
  };

  // Filtered upcoming events
  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((evt) => {
      // Type filter
      if (selectedType !== "all" && evt.type !== selectedType) {
        return false;
      }
      // Club/Location filter
      if (selectedClub !== "all") {
        if (selectedClub === "other" && evt.club && evt.club !== "other") {
          return false;
        }
        if (selectedClub !== "other" && evt.club !== selectedClub) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = evt.title.toLowerCase().includes(q);
        const inDesc = evt.description.toLowerCase().includes(q);
        const inLoc = evt.location.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inLoc) {
          return false;
        }
      }
      return true;
    });
  }, [upcomingEvents, selectedType, selectedClub, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedType !== "all" ||
    selectedClub !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedClub("all");
  };

  const typeFilterClass = (activeType: EventType | "all") => {
    const isActive = selectedType === activeType;
    const base = "btn btn-sm akce-filter-pill";
    if (!isActive) {
      return base;
    }
    switch (activeType) {
      case "tournament":
        return `${base} akce-filter-pill--active akce-filter-pill--tournament`;
      case "workshop":
        return `${base} akce-filter-pill--active akce-filter-pill--workshop`;
      default:
        return `${base} akce-filter-pill--active`;
    }
  };

  const clubFilterClass = (club: EventClub | "all") =>
    selectedClub === club
      ? "btn btn-sm akce-filter-pill akce-filter-pill--active"
      : "btn btn-sm akce-filter-pill";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-2 pt-lg-3 pb-4">
        <div className="row justify-content-center text-center">
          <div className="col-lg-9">
            <h1 className="display-4 fw-bold mb-3">{heroTitle}</h1>
            <p className="lead mb-4 text-muted mx-auto akce-hero-lead">
              {heroLead}
            </p>

            <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 gap-sm-3">
              {hasCalendarConfig && (
                <button
                  type="button"
                  className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
                  onClick={() => setIsSubscribeModalOpen(true)}
                >
                  <i className="bi bi-calendar2-check"></i>
                  Odebírat kalendář akcí
                </button>
              )}

              <a
                href={emptyDiscordHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-discord"></i>
                Náš Discord
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="card akce-filter-bar p-3 p-md-4 border-0">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-xl-4 position-relative">
              <i className="bi bi-search akce-search-icon"></i>
              <input
                type="text"
                className="form-control akce-search-input"
                placeholder="Hledat akci, téma, město..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Hledat v kalendáři"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-link akce-search-clear p-1"
                  onClick={() => setSearchQuery("")}
                  title="Smazat hledání"
                  aria-label="Smazat hledání"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>

            <div className="col-12 col-xl-8">
              <div className="d-flex flex-wrap align-items-center justify-content-xl-between gap-2.5">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <button
                    type="button"
                    className={typeFilterClass("all")}
                    onClick={() => setSelectedType("all")}
                  >
                    Všechny akce
                  </button>
                  <button
                    type="button"
                    className={`${typeFilterClass("tournament")} d-inline-flex align-items-center gap-1`}
                    onClick={() => setSelectedType("tournament")}
                  >
                    <i className="bi bi-trophy-fill"></i>
                    Turnaje
                  </button>
                  <button
                    type="button"
                    className={`${typeFilterClass("workshop")} d-inline-flex align-items-center gap-1`}
                    onClick={() => setSelectedType("workshop")}
                  >
                    <i className="bi bi-lightbulb-fill"></i>
                    Workshopy
                  </button>
                  <button
                    type="button"
                    className={`${typeFilterClass("debate")} d-inline-flex align-items-center gap-1`}
                    onClick={() => setSelectedType("debate")}
                  >
                    <i className="bi bi-chat-dots-fill"></i>
                    Debaty
                  </button>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="text-muted small fw-medium me-1 d-none d-sm-inline">
                    Místo:
                  </span>
                  <button
                    type="button"
                    className={clubFilterClass("all")}
                    onClick={() => setSelectedClub("all")}
                  >
                    Vše
                  </button>
                  <button
                    type="button"
                    className={`${clubFilterClass("praha")} d-inline-flex align-items-center gap-1`}
                    onClick={() => setSelectedClub("praha")}
                  >
                    <i className="bi bi-geo-alt-fill"></i>
                    Praha
                  </button>
                  <button
                    type="button"
                    className={`${clubFilterClass("plzen")} d-inline-flex align-items-center gap-1`}
                    onClick={() => setSelectedClub("plzen")}
                  >
                    <i className="bi bi-geo-alt-fill"></i>
                    Plzeň
                  </button>
                  <button
                    type="button"
                    className={`${clubFilterClass("online")} d-inline-flex align-items-center gap-1`}
                    onClick={() => setSelectedClub("online")}
                  >
                    <i className="bi bi-camera-video-fill"></i>
                    Online
                  </button>
                </div>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="akce-filter-summary d-flex flex-wrap align-items-center justify-content-between">
              <p className="mb-0">
                Nalezeno{" "}
                <strong className="text-body">{filteredEvents.length}</strong> z{" "}
                {upcomingEvents.length} akcí
              </p>
              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none text-danger p-0 d-inline-flex align-items-center gap-1 fw-semibold"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle"></i>
                Zrušit filtry
              </button>
            </div>
          )}
        </div>
      </section>

      <nav className="nav nav-pills nav-fill akce-mobile-tabs d-lg-none mb-4">
        <button
          type="button"
          className={`nav-link ${mobileTab === "list" ? "active" : ""}`}
          onClick={() => setMobileTab("list")}
        >
          <i className="bi bi-list-ul me-2"></i>
          Seznam akcí ({filteredEvents.length})
        </button>
        <button
          type="button"
          className={`nav-link ${mobileTab === "calendar" ? "active" : ""}`}
          onClick={() => setMobileTab("calendar")}
        >
          <i className="bi bi-calendar3 me-2"></i>
          Měsíční kalendář
        </button>
      </nav>

      {/* Main Content Layout */}
      <section className="mb-4 mb-lg-5">
        <div className="row g-4">
          {/* ============================================================== */}
          {/* LEFT COLUMN: Upcoming events list                              */}
          {/* ============================================================== */}
          <div
            className={`col-lg-6 col-xl-7 akce-events-col ${
              mobileTab === "calendar" ? "d-none d-lg-block" : "d-block"
            }`}
          >
            <h2 className="akce-section-heading fw-bold mb-3 pb-2 border-bottom border-light-subtle d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-primary"></i>
              Nadcházející akce
              {!loading && !error && filteredEvents.length > 0 && (
                <span className="badge bg-primary-light text-primary rounded-pill akce-count-badge ms-auto">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1
                    ? "akce"
                    : filteredEvents.length < 5
                    ? "akce"
                    : "akcí"}
                </span>
              )}
            </h2>

            {loading &&
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="card event-card p-3 p-md-4 placeholder-glow"
                >
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded placeholder"
                      style={{ width: "66px", height: "78px" }}
                    />
                    <div className="flex-grow-1">
                      <div className="placeholder col-4 mb-2 rounded" />
                      <div className="placeholder col-8 mb-2 d-block rounded" />
                      <div className="placeholder col-6 mb-3 d-block rounded" />
                      <div className="placeholder col-3 rounded" />
                    </div>
                  </div>
                </div>
              ))}

            {!loading && error && (
              <div className="card akce-state-card p-4 p-md-5 text-center border-0">
                <i className="bi bi-exclamation-triangle"></i>
                <h4 className="fw-bold mb-2">{errorTitle}</h4>
                <p className="text-muted mb-4 akce-state-text">{errorText}</p>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                  onClick={handleManualRetry}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                  {retryBtnText}
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              upcomingEvents.length > 0 &&
              filteredEvents.length === 0 && (
                <div className="card akce-state-card p-4 p-md-5 text-center border-0">
                  <i className="bi bi-funnel"></i>
                  <h4 className="fw-bold mb-2">Žádná akce neodpovídá filtrům</h4>
                  <p className="text-muted mb-4 akce-state-text">
                    Pro zadaná kritéria jsme nenašli žádnou naplánovanou akci.
                    Zkuste upravit text vyhledávání nebo změnit zvolený typ či místo.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                    onClick={clearFilters}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    Resetovat filtry
                  </button>
                </div>
              )}

            {!loading && !error && upcomingEvents.length === 0 && (
              <div className="card akce-state-card p-4 p-md-5 text-center border-0">
                <i className="bi bi-calendar-x"></i>
                <h4 className="fw-bold mb-2">{emptyTitle}</h4>
                <p className="text-muted mb-4 akce-state-text">{emptyText}</p>
                <div className="d-inline-flex flex-wrap justify-content-center gap-2">
                  <a
                    href={emptyDiscordHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2"
                  >
                    <i className="bi bi-discord"></i>
                    {emptyDiscordBtn}
                  </a>
                  <a
                    href="/contacts"
                    className="btn btn-primary d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2"
                  >
                    <i className="bi bi-envelope"></i>
                    Kontakty
                  </a>
                </div>
              </div>
            )}

            {!loading &&
              !error &&
              filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isSelected={evt.id === selectedEventId}
                  onSelect={handleSelectEvent}
                />
              ))}
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Interactive Monthly Calendar                     */}
          {/* ============================================================== */}
          <div
            className={`col-lg-6 col-xl-5 calendar-sticky-wrapper ${
              mobileTab === "list" ? "d-none d-lg-block" : "d-block"
            }`}
          >
            <h2 className="akce-section-heading fw-bold mb-3 pb-2 border-bottom border-light-subtle d-flex align-items-center gap-2">
              <i className="bi bi-calendar3 text-primary"></i>
              Měsíční kalendář
            </h2>

            {loading ? (
              <div className="card custom-calendar-container p-4 text-center placeholder-glow border-0">
                <div className="placeholder col-6 mx-auto mb-4 py-3 rounded" />
                <div className="placeholder col-12 mb-3 py-5 rounded" />
                <div className="placeholder col-8 mx-auto py-2 rounded" />
              </div>
            ) : (
              <MonthlyCalendar
                events={monthEvents}
                currentDate={currentCalendarDate}
                onMonthChange={handleMonthChange}
                selectedEventId={selectedEventId}
                onSelectEvent={handleSelectEvent}
                isLoadingMonth={isLoadingMonth}
              />
            )}
          </div>
        </div>
      </section>

      <section className="py-5 px-4 rounded bg-primary-light mb-4 mb-lg-5 shadow-sm text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="display-6 fw-bold mb-3">Máte dotaz nebo nápad na akci?</h2>
            <p className="lead mb-4 text-muted akce-cta-lead">
              Chcete uspořádat turnaj, workshop nebo volnočasovou aktivitu? Napište nám na Discord nebo se obraťte na vedení spolku.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a
                href={emptyDiscordHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-discord"></i>
                Náš Discord
              </a>
              <a
                href="/contacts"
                className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-envelope"></i>
                Stránka s kontakty
              </a>
            </div>
          </div>
        </div>
      </section>

      <SubscribeCalendarModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </Layout>
  );
}

export const Head = () => (
  <SEO
    title="Kalendář akcí, turnajů a workshopů | Debatní spolek"
    description="Přehled turnajů, workshopů a volnočasových aktivit Debatního spolku mimo běžné fungování debatních klubů."
    pathname="/akce"
  />
);
