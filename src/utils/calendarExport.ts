import { CalendarEvent, EventClub } from "../types/calendar";

/**
 * Strips HTML tags and unescapes common HTML entities for plain-text representations.
 */
export function cleanHtmlDescription(html: string): string {
  if (!html) return "";
  return html
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Formats a Date into YYYYMMDDTHHmmssZ for UTC calendar format.
 */
function toUtcCompactIso(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Formats a Date into YYYYMMDD for all-day calendar format.
 */
function toCompactDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Generates an URL to add this specific event to Google Calendar.
 */
export function createGoogleCalendarUrl(event: CalendarEvent): string {
  let datesParam: string;

  if (event.isAllDay) {
    const startStr = toCompactDate(event.start);
    // Google Calendar all-day event end date is exclusive (day after)
    const nextDay = new Date(event.end.getTime());
    // If end is same as start (or start + 0), advance by 1 day
    if (nextDay.getTime() <= event.start.getTime()) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    const endStr = toCompactDate(nextDay);
    datesParam = `${startStr}/${endStr}`;
  } else {
    let end = event.end;
    if (end.getTime() <= event.start.getTime()) {
      end = new Date(event.start.getTime() + 60 * 60 * 1000);
    }
    datesParam = `${toUtcCompactIso(event.start)}/${toUtcCompactIso(end)}`;
  }

  const plainDesc = cleanHtmlDescription(event.description);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: datesParam,
  });

  if (plainDesc) {
    params.set("details", plainDesc);
  }

  if (event.location) {
    params.set("location", event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Escapes characters for iCalendar (RFC 5545) text fields.
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Generates and triggers download of an .ics file for this event.
 */
export function downloadIcsFile(event: CalendarEvent): void {
  const plainDesc = cleanHtmlDescription(event.description);
  const nowUtc = toUtcCompactIso(new Date());

  let startLine: string;
  let endLine: string;

  if (event.isAllDay) {
    const startStr = toCompactDate(event.start);
    const nextDay = new Date(event.end.getTime());
    if (nextDay.getTime() <= event.start.getTime()) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    const endStr = toCompactDate(nextDay);
    startLine = `DTSTART;VALUE=DATE:${startStr}`;
    endLine = `DTEND;VALUE=DATE:${endStr}`;
  } else {
    let end = event.end;
    if (end.getTime() <= event.start.getTime()) {
      end = new Date(event.start.getTime() + 60 * 60 * 1000);
    }
    startLine = `DTSTART:${toUtcCompactIso(event.start)}`;
    endLine = `DTEND:${toUtcCompactIso(end)}`;
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Debatni spolek Debatniho deniku//Events//CS",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id || Date.now()}@debatnispolek.debatnidenik.cz`,
    `DTSTAMP:${nowUtc}`,
    startLine,
    endLine,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];

  if (plainDesc) {
    lines.push(`DESCRIPTION:${escapeIcsText(plainDesc)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  }

  if (event.htmlLink) {
    lines.push(`URL:${escapeIcsText(event.htmlLink)}`);
  }

  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");

  const icsData = lines.join("\r\n");
  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);

  const safeFilename =
    event.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "akce";

  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = `${safeFilename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}

/* ------------------------------------------------------------------ */
/* Czech Date / Time formatting helpers                                */
/* ------------------------------------------------------------------ */

const CZECH_MONTHS = [
  "leden",
  "únor",
  "březen",
  "duben",
  "květen",
  "červen",
  "červenec",
  "srpen",
  "září",
  "říjen",
  "listopad",
  "prosinec",
];

const CZECH_MONTHS_GENITIVE = [
  "ledna",
  "února",
  "března",
  "dubna",
  "května",
  "června",
  "července",
  "srpna",
  "září",
  "října",
  "listopadu",
  "prosince",
];

const CZECH_MONTHS_ABBREV = [
  "LED",
  "ÚNO",
  "BŘE",
  "DUB",
  "KVĚ",
  "ČVN",
  "ČVC",
  "SRP",
  "ZÁŘ",
  "ŘÍJ",
  "LIS",
  "PRO",
];

const CZECH_WEEKDAYS = [
  "neděle",
  "pondělí",
  "úterý",
  "středa",
  "čtvrtek",
  "pátek",
  "sobota",
];

const CZECH_WEEKDAYS_SHORT = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

/**
 * Format e.g. "pondělí 5. října 2026"
 */
export function formatCzechFullDate(d: Date): string {
  const weekday = CZECH_WEEKDAYS[d.getDay()];
  const capitalizedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const day = d.getDate();
  const month = CZECH_MONTHS_GENITIVE[d.getMonth()];
  const year = d.getFullYear();
  return `${capitalizedWeekday} ${day}. ${month} ${year}`;
}

/**
 * Format e.g. "5. 10. 2026"
 */
export function formatCzechShortDate(d: Date): string {
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

/**
 * Format e.g. "Říjen 2026"
 */
export function formatCzechMonthYear(d: Date): string {
  const month = CZECH_MONTHS[d.getMonth()];
  const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capitalized} ${d.getFullYear()}`;
}

/**
 * Formats time range e.g. "18:00 – 20:30" or "Celý den"
 */
export function formatCzechTimeRange(
  start: Date,
  end: Date,
  isAllDay: boolean
): string {
  if (isAllDay) {
    return "Celý den";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
  const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

  if (startTime === endTime) {
    return startTime;
  }
  return `${startTime} – ${endTime}`;
}

/**
 * Returns date badge info for cards
 */
export function getDateBadgeInfo(d: Date): {
  day: string;
  monthAbbrev: string;
  weekdayAbbrev: string;
} {
  return {
    day: String(d.getDate()).padStart(2, "0"),
    monthAbbrev: CZECH_MONTHS_ABBREV[d.getMonth()],
    weekdayAbbrev: CZECH_WEEKDAYS_SHORT[d.getDay()],
  };
}

/**
 * Checks if two dates are the same day (local time).
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Checks if date is today.
 */
export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

/**
 * Checks if date is tomorrow.
 */
export function isTomorrow(d: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(d, tomorrow);
}

/**
 * Returns "Dnes" or "Zítra" if applicable, otherwise null.
 */
export function getRelativeDayBadge(d: Date): string | null {
  if (isToday(d)) return "Dnes";
  if (isTomorrow(d)) return "Zítra";
  return null;
}

/**
 * Detects debate club or city based on location, title and description text.
 */
export function detectEventClub(
  location?: string,
  summary?: string,
  description?: string
): EventClub {
  const text = `${location || ""} ${summary || ""} ${description || ""}`.toLowerCase();
  if (
    text.includes("praha") ||
    text.includes("prague") ||
    text.includes("fit") ||
    text.includes("čvut") ||
    text.includes("cvut") ||
    text.includes("dejvice") ||
    text.includes("thákurova")
  ) {
    return "praha";
  }
  if (
    text.includes("plzeň") ||
    text.includes("plzen") ||
    text.includes("pilsen") ||
    text.includes("zču") ||
    text.includes("zcu")
  ) {
    return "plzen";
  }
  if (
    text.includes("online") ||
    text.includes("discord") ||
    text.includes("zoom") ||
    text.includes("google meet") ||
    text.includes("teams")
  ) {
    return "online";
  }
  return "other";
}

/**
 * Returns formatted club label, icon, and badge class.
 */
export function getClubBadgeInfo(club?: EventClub): {
  label: string;
  fullLabel: string;
  icon: string;
} | null {
  switch (club) {
    case "praha":
      return {
        label: "Praha",
        fullLabel: "Praha • FIT ČVUT",
        icon: "bi-buildings",
      };
    case "plzen":
      return {
        label: "Plzeň",
        fullLabel: "Plzeň",
        icon: "bi-geo-alt",
      };
    case "online":
      return {
        label: "Online",
        fullLabel: "Online • Discord",
        icon: "bi-camera-video",
      };
    default:
      return null;
  }
}

/**
 * Creates Google Maps URL for an event location.
 */
export function createGoogleMapsUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.trim())}`;
}

export type EventStatusVariant = "ongoing" | "today" | "tomorrow" | "soon" | "none";

/**
 * Returns countdown or status badge for an event.
 */
export function getEventStatusBadge(
  start: Date,
  end: Date,
  isAllDay: boolean,
  now = new Date()
): { text: string; variant: EventStatusVariant } {
  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();

  // Currently happening
  if (!isAllDay && nowMs >= startMs && nowMs <= endMs) {
    return { text: "Právě probíhá", variant: "ongoing" };
  }

  if (isToday(start)) {
    return { text: "Dnes", variant: "today" };
  }

  if (isTomorrow(start)) {
    return { text: "Zítra", variant: "tomorrow" };
  }

  const diffDays = Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24));
  if (diffDays > 1 && diffDays <= 7) {
    return {
      text: diffDays >= 2 && diffDays <= 4 ? `Za ${diffDays} dny` : `Za ${diffDays} dní`,
      variant: "soon",
    };
  }

  return { text: "", variant: "none" };
}

/**
 * Subscription URLs for public Debatní spolek calendar.
 */
export function getPublicCalendarSubscribeUrls(calendarId?: string) {
  const calId =
    calendarId ||
    process.env.GATSBY_GOOGLE_CALENDAR_ID;

  if (!calId) {
    return null;
  }

  const encodedId = encodeURIComponent(calId);
  return {
    calId,
    google: `https://calendar.google.com/calendar/render?cid=${encodedId}`,
    iCal: `https://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`,
    webcal: `webcal://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`,
    embed: `https://calendar.google.com/calendar/embed?src=${encodedId}&ctz=Europe%2FPrague`,
  };
}
