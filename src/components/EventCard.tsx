import React, { useState } from "react";
import { CalendarEvent } from "../types/calendar";
import AddToCalendarButton from "./AddToCalendarButton";
import {
  getDateBadgeInfo,
  formatCzechFullDate,
  formatCzechTimeRange,
  cleanHtmlDescription,
  getClubBadgeInfo,
  createGoogleMapsUrl,
  getEventStatusBadge,
} from "../utils/calendarExport";

interface EventCardProps {
  event: CalendarEvent;
  isSelected?: boolean;
  onSelect?: (event: CalendarEvent) => void;
  compact?: boolean;
}

/**
 * Parses text and turns URLs into clickable links.
 */
function renderWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      const cleanUrl = part.replace(/[.,)]+$/, "");
      const trailing = part.slice(cleanUrl.length);
      return (
        <React.Fragment key={i}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-underline word-break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {cleanUrl.length > 40 ? `${cleanUrl.slice(0, 37)}...` : cleanUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    return part;
  });
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isSelected = false,
  onSelect,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dateBadge = getDateBadgeInfo(event.start);
  const statusInfo = getEventStatusBadge(event.start, event.end, event.isAllDay);
  const clubInfo = getClubBadgeInfo(event.club);
  const plainDesc = cleanHtmlDescription(event.description);
  const timeText = formatCzechTimeRange(event.start, event.end, event.isAllDay);
  const fullDateText = formatCzechFullDate(event.start);

  const renderTypeBadge = () => {
    switch (event.type) {
      case "debate":
        return (
          <span className="badge bg-primary text-white rounded-pill px-2.5 py-1">
            <i className="bi bi-chat-dots-fill me-1"></i>Debata
          </span>
        );
      case "tournament":
        return (
          <span className="badge bg-danger text-white rounded-pill px-2.5 py-1">
            <i className="bi bi-trophy-fill me-1"></i>Turnaj
          </span>
        );
      case "workshop":
        return (
          <span className="badge bg-warning text-dark rounded-pill px-2.5 py-1">
            <i className="bi bi-lightbulb-fill me-1"></i>Workshop
          </span>
        );
      default:
        return (
          <span className="badge bg-info text-dark rounded-pill px-2.5 py-1">
            <i className="bi bi-calendar-event me-1"></i>Akce
          </span>
        );
    }
  };

  const renderStatusBadge = () => {
    if (statusInfo.variant === "none") return null;

    if (statusInfo.variant === "ongoing") {
      return (
        <span className="badge bg-success text-white rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1">
          <span className="spinner-grow spinner-grow-sm" style={{ width: "0.55rem", height: "0.55rem" }}></span>
          {statusInfo.text}
        </span>
      );
    }

    if (statusInfo.variant === "today") {
      return (
        <span className="badge bg-success text-white rounded-pill px-2.5 py-1">
          {statusInfo.text}
        </span>
      );
    }

    if (statusInfo.variant === "tomorrow") {
      return (
        <span className="badge bg-info text-dark rounded-pill px-2.5 py-1">
          {statusInfo.text}
        </span>
      );
    }

    if (statusInfo.variant === "soon") {
      return (
        <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill px-2.5 py-1">
          {statusInfo.text}
        </span>
      );
    }

    return null;
  };

  const isLongDesc = plainDesc.length > 170;
  const displayedDesc = isExpanded || !isLongDesc ? plainDesc : `${plainDesc.slice(0, 160)}...`;

  const cardClasses = [
    "card",
    "event-card",
    `event-card--${event.type}`,
    isSelected ? "event-card--active shadow" : "shadow-sm",
    compact ? "p-3" : "p-3 p-md-4",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      <div className="d-flex align-items-start gap-3">
        {/* Date block */}
        <div className={`event-date-box flex-shrink-0 text-center event-date-box--${event.type}`}>
          <div className="event-date-month">{dateBadge.monthAbbrev}</div>
          <div className="event-date-day">{dateBadge.day}</div>
          <div className="event-date-weekday">{dateBadge.weekdayAbbrev}</div>
        </div>

        {/* Content details */}
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            {renderTypeBadge()}
            {renderStatusBadge()}

            {clubInfo && (
              <span className="badge bg-light text-dark border rounded-pill px-2.5 py-1 small fw-semibold">
                <i className={`bi ${clubInfo.icon} me-1 text-primary`}></i>
                {clubInfo.label}
              </span>
            )}

            {!compact && (
              <small className="text-muted d-none d-sm-inline ms-sm-auto">
                {fullDateText}
              </small>
            )}
          </div>

          <h3
            className={`${
              compact ? "h6 mb-1.5" : "h5 mb-2"
            } fw-bold text-body event-card-title text-wrap`}
          >
            {event.title}
          </h3>

          {/* Time & Location */}
          <div className="d-flex flex-wrap align-items-center event-card-meta text-muted small mb-2">
            <div className="d-inline-flex align-items-center">
              <i className="bi bi-clock me-1 text-primary"></i>
              <span className="fw-medium">{timeText}</span>
            </div>

            {event.location && (
              <a
                href={createGoogleMapsUrl(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="event-card-location-link d-inline-flex align-items-center text-truncate"
                title={`Otevřít místo v Mapách Google: ${event.location}`}
                onClick={(e) => e.stopPropagation()}
              >
                <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                <span className="text-truncate" style={{ maxWidth: compact ? "180px" : "280px" }}>
                  {event.location}
                </span>
                <i className="bi bi-box-arrow-up-right ms-1 small opacity-50"></i>
              </a>
            )}
          </div>

          {/* Description */}
          {plainDesc && (
            <div className="event-card-desc text-muted small mb-3">
              <div style={{ whiteSpace: "pre-line" }}>
                {renderWithLinks(displayedDesc)}
              </div>
              {isLongDesc && (
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary small fw-semibold text-decoration-none mt-1 d-inline-flex align-items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded((prev) => !prev);
                  }}
                >
                  <span>{isExpanded ? "Zobrazit méně" : "Zobrazit více informací"}</span>
                  <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 event-card-actions">
            <AddToCalendarButton event={event} size="sm" />

            <div className="d-inline-flex align-items-center gap-2">
              {event.location && (
                <a
                  href={createGoogleMapsUrl(event.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light event-card-action-btn d-inline-flex align-items-center gap-1"
                  title="Zobrazit na mapě"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="bi bi-map"></i>
                  <span className="d-none d-sm-inline">Mapa</span>
                </a>
              )}

              {event.htmlLink && (
                <a
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-link text-decoration-none text-muted d-inline-flex align-items-center gap-1 px-2"
                  title="Otevřít detail události v Google Kalendáři"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Detail</span>
                  <i className="bi bi-box-arrow-up-right small"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
