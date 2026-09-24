export type EventType = "debate" | "tournament" | "workshop" | "other";
export type EventClub = "praha" | "plzen" | "online" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  htmlLink: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  dateKey: string; // "YYYY-MM-DD" local format
  type: EventType;
  club?: EventClub;
}

export interface GoogleCalendarApiItem {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
}

export interface GoogleCalendarApiResponse {
  items?: GoogleCalendarApiItem[];
  error?: {
    code: number;
    message: string;
    errors?: Array<{
      domain: string;
      reason: string;
      message: string;
    }>;
  };
}

export type CalendarStatus = "idle" | "loading" | "success" | "error";
