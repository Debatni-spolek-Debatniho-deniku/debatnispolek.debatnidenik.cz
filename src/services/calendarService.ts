import {
  CalendarEvent,
  EventType,
  GoogleCalendarApiItem,
  GoogleCalendarApiResponse,
} from "../types/calendar";
import { detectEventClub } from "../utils/calendarExport";

/**
 * Infer event type from summary and description.
 */
function inferEventType(summary?: string, description?: string): EventType {
  const text = `${summary || ""} ${description || ""}`.toLowerCase();
  if (
    text.includes("turnaj") ||
    text.includes("turnaji") ||
    text.includes("tournament")
  ) {
    return "tournament";
  }
  if (
    text.includes("workshop") ||
    text.includes("školení") ||
    text.includes("seminář") ||
    text.includes("přednáška")
  ) {
    return "workshop";
  }
  if (
    text.includes("debata") ||
    text.includes("debatní") ||
    text.includes("schůzka") ||
    text.includes("setkání") ||
    text.includes("klub")
  ) {
    return "debate";
  }
  return "other";
}

/**
 * Parses raw Google Calendar API event item into CalendarEvent.
 */
function parseApiEvent(item: GoogleCalendarApiItem): CalendarEvent | null {
  if (!item.id || item.status === "cancelled") {
    return null;
  }

  const isAllDay = Boolean(item.start?.date && !item.start?.dateTime);
  let start: Date;
  let end: Date;

  if (isAllDay && item.start?.date) {
    const parts = item.start.date.split("-").map(Number);
    if (parts.length < 3 || parts.some(isNaN)) return null;
    start = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);

    if (item.end?.date) {
      const endParts = item.end.date.split("-").map(Number);
      if (endParts.length >= 3 && !endParts.some(isNaN)) {
        end = new Date(endParts[0], endParts[1] - 1, endParts[2], 0, 0, 0);
      } else {
        end = new Date(start.getTime());
      }
    } else {
      end = new Date(start.getTime());
    }
  } else if (item.start?.dateTime) {
    start = new Date(item.start.dateTime);
    if (isNaN(start.getTime())) return null;

    if (item.end?.dateTime) {
      end = new Date(item.end.dateTime);
      if (isNaN(end.getTime())) {
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }
    } else {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }
  } else {
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateKey = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;

  return {
    id: item.id,
    title: item.summary?.trim() || "Debatní setkání",
    description: item.description?.trim() || "",
    location: item.location?.trim() || "",
    htmlLink: item.htmlLink || "",
    start,
    end,
    isAllDay,
    dateKey,
    type: inferEventType(item.summary, item.description),
    club: detectEventClub(item.location, item.summary, item.description),
  };
}

export interface FetchResult {
  success: boolean;
  events?: CalendarEvent[];
  upcomingEvents?: CalendarEvent[];
  error?: string;
  isQuotaOrRateLimit?: boolean;
}

class GoogleCalendarService {
  private monthCache = new Map<string, CalendarEvent[]>();
  private upcomingCache: CalendarEvent[] | null = null;
  private circuitBroken = false;
  private lastErrorMessage: string | null = null;
  private isInitialLoaded = false;

  /**
   * Resets circuit breaker for a single manual retry by user.
   */
  public resetCircuitBreaker(): void {
    this.circuitBroken = false;
    this.lastErrorMessage = null;
  }

  public isCircuitBroken(): boolean {
    return this.circuitBroken;
  }

  public getMonthKey(year: number, monthIndex: number): string {
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  }

  private getCredentials(): { apiKey?: string; calendarId?: string } {
    const apiKey = process.env.GATSBY_GOOGLE_CALENDAR_API_KEY;
    const calendarId = process.env.GATSBY_GOOGLE_CALENDAR_ID;
    return { apiKey, calendarId };
  }

  /**
   * Performs an optimized HTTP fetch against Google Calendar API v3.
   * STRICT COST PROTECTION:
   * - No polling, no auto-refresh, no infinite retry.
   * - Trips circuit breaker on 403, 429, quotaExceeded, billing errors, invalid keys.
   */
  private async queryCalendar(
    timeMin: Date,
    timeMax: Date,
    maxResults = 100
  ): Promise<CalendarEvent[]> {
    if (this.circuitBroken) {
      throw new Error(
        this.lastErrorMessage ||
          "Google Calendar API je dočasně uzamčeno z důvodu předchozí chyby."
      );
    }

    const { apiKey, calendarId } = this.getCredentials();

    if (!apiKey || !calendarId) {
      console.error(
        "[Calendar] Chybí GATSBY_GOOGLE_CALENDAR_API_KEY nebo GATSBY_GOOGLE_CALENDAR_ID."
      );
      throw new Error("MISSING_CONFIG");
    }

    const encodedCalId = encodeURIComponent(calendarId);
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events`
    );

    url.searchParams.set("key", apiKey);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("timeMin", timeMin.toISOString());
    url.searchParams.set("timeMax", timeMax.toISOString());
    url.searchParams.set("maxResults", String(maxResults));

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (networkError) {
      console.error("[Calendar] Chyba sítě při volání Google Calendar API:", networkError);
      throw new Error("NETWORK_ERROR");
    }

    if (!response.ok) {
      let errorData: GoogleCalendarApiResponse | null = null;
      try {
        errorData = await response.json();
      } catch {
        // Ignore JSON parse error
      }

      const status = response.status;
      const apiReason = errorData?.error?.errors?.[0]?.reason || "";
      const apiMessage = errorData?.error?.message || `HTTP ${status}`;

      console.error(
        `[Calendar] Google Calendar API selhalo se statusem ${status} (${apiReason}): ${apiMessage}`
      );

      // Lock on 403, 429, 5xx, quotaExceeded, etc.
      if (
        status === 403 ||
        status === 429 ||
        status >= 500 ||
        apiReason.includes("quota") ||
        apiReason.includes("rateLimit") ||
        apiReason.includes("keyInvalid") ||
        apiReason.includes("accessNotConfigured")
      ) {
        this.circuitBroken = true;
        this.lastErrorMessage = `API Error ${status}: ${apiReason || apiMessage}`;
      }

      throw new Error(apiMessage);
    }

    const data: GoogleCalendarApiResponse = await response.json();
    const items = data.items || [];

    const parsed: CalendarEvent[] = [];
    for (const item of items) {
      const evt = parseApiEvent(item);
      if (evt) {
        parsed.push(evt);
      }
    }

    return parsed;
  }

  /**
   * Fetches initial events on page mount.
   * Single request covering 3 months from start of current month.
   * Populates cache and extracts closest 5 upcoming future events.
   */
  public async fetchInitialData(now = new Date()): Promise<FetchResult> {
    if (this.isInitialLoaded && this.upcomingCache) {
      const currentKey = this.getMonthKey(now.getFullYear(), now.getMonth());
      return {
        success: true,
        upcomingEvents: this.upcomingCache,
        events: this.monthCache.get(currentKey) || [],
      };
    }

    const { apiKey, calendarId } = this.getCredentials();
    if (!apiKey || !calendarId) {
      console.warn(
        `[Calendar] Kalendář se nenačítá, protože v souboru .env chybí: ${
          !apiKey ? "GATSBY_GOOGLE_CALENDAR_API_KEY " : ""
        }${!calendarId ? "GATSBY_GOOGLE_CALENDAR_ID" : ""}`
      );
      return {
        success: false,
        error: "Akce se momentálně nepodařilo načíst. Zkuste to prosím později.",
      };
    }

    // Window: from 1st day of current month 00:00:00 to end of 2 months ahead
    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const endOfRange = new Date(
      now.getFullYear(),
      now.getMonth() + 3,
      0,
      23,
      59,
      59,
      999
    );

    try {
      const allEvents = await this.queryCalendar(startOfCurrentMonth, endOfRange, 100);

      // Populate month cache for all events loaded
      for (const event of allEvents) {
        const key = this.getMonthKey(
          event.start.getFullYear(),
          event.start.getMonth()
        );
        const list = this.monthCache.get(key) || [];
        list.push(event);
        this.monthCache.set(key, list);
      }

      // Ensure even empty months in range are initialized in cache so we know they were loaded
      for (let i = 0; i < 3; i++) {
        const mDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const key = this.getMonthKey(mDate.getFullYear(), mDate.getMonth());
        if (!this.monthCache.has(key)) {
          this.monthCache.set(key, []);
        }
      }

      // Extract all upcoming events in loaded range (or currently ongoing today)
      const nowMs = now.getTime();
      const futureEvents = allEvents
        .filter((e) => e.end.getTime() >= nowMs)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 20);

      this.upcomingCache = futureEvents;
      this.isInitialLoaded = true;

      const currentKey = this.getMonthKey(now.getFullYear(), now.getMonth());
      return {
        success: true,
        upcomingEvents: futureEvents,
        events: this.monthCache.get(currentKey) || [],
      };
    } catch (err: any) {
      return {
        success: false,
        error: "Akce se momentálně nepodařilo načíst. Zkuste to prosím později.",
        isQuotaOrRateLimit: this.circuitBroken,
      };
    }
  }

  /**
   * Fetches events for a specific month.
   * Returns instantly from cache if previously loaded (0 API calls).
   * Otherwise makes exactly ONE request for that month and caches it.
   */
  public async fetchMonth(
    year: number,
    monthIndex: number
  ): Promise<FetchResult> {
    const key = this.getMonthKey(year, monthIndex);

    // Cache hit -> 0 requests!
    if (this.monthCache.has(key)) {
      return {
        success: true,
        events: this.monthCache.get(key) || [],
      };
    }

    if (this.circuitBroken) {
      return {
        success: false,
        error: "Akce se momentálně nepodařilo načíst. Zkuste to prosím později.",
        isQuotaOrRateLimit: true,
      };
    }

    const { apiKey, calendarId } = this.getCredentials();
    if (!apiKey || !calendarId) {
      return {
        success: false,
        error: "Akce se momentálně nepodařilo načíst. Zkuste to prosím později.",
      };
    }

    const timeMin = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const timeMax = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    try {
      const events = await this.queryCalendar(timeMin, timeMax, 60);
      this.monthCache.set(key, events);
      return {
        success: true,
        events,
      };
    } catch (err: any) {
      return {
        success: false,
        error: "Akce se momentálně nepodařilo načíst. Zkuste to prosím později.",
        isQuotaOrRateLimit: this.circuitBroken,
      };
    }
  }

  /**
   * Clears in-memory caches (e.g. for testing or manual hard refresh)
   */
  public clearCache(): void {
    this.monthCache.clear();
    this.upcomingCache = null;
    this.isInitialLoaded = false;
    this.circuitBroken = false;
    this.lastErrorMessage = null;
  }
}

export const calendarService = new GoogleCalendarService();
