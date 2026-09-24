import React, { useState, useMemo } from "react";
import { CalendarEvent } from "../types/calendar";
import EventCard from "./EventCard";
import {
  formatCzechMonthYear,
  formatCzechFullDate,
  isSameDay,
  isToday,
} from "../utils/calendarExport";

interface MonthlyCalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onMonthChange: (year: number, monthIndex: number) => void;
  selectedEventId?: string | null;
  onSelectEvent?: (event: CalendarEvent) => void;
  isLoadingMonth?: boolean;
}

interface CalendarDayItem {
  date: Date;
  isCurrentMonth: boolean;
  dateKey: string;
  isToday: boolean;
  events: CalendarEvent[];
}

const WEEKDAY_NAMES = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  events,
  currentDate,
  onMonthChange,
  selectedEventId,
  onSelectEvent,
  isLoadingMonth = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Map events by dateKey (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.dateKey) || [];
      list.push(event);
      map.set(event.dateKey, list);
    }
    return map;
  }, [events]);

  // Generate calendar days for the monthly grid
  const calendarDays = useMemo(() => {
    const days: CalendarDayItem[] = [];

    // First day of current month
    const firstDay = new Date(year, month, 1);
    // European Monday-first index: 0 = Monday, ..., 6 = Sunday
    const startDayIndex = (firstDay.getDay() + 6) % 7;

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      days.push({
        date: d,
        isCurrentMonth: false,
        dateKey,
        isToday: isToday(d),
        events: eventsByDate.get(dateKey) || [],
      });
    }

    // Current month days
    const currentMonthDaysCount = new Date(year, month + 1, 0).getDate();
    for (let dayNum = 1; dayNum <= currentMonthDaysCount; dayNum++) {
      const d = new Date(year, month, dayNum);
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      days.push({
        date: d,
        isCurrentMonth: true,
        dateKey,
        isToday: isToday(d),
        events: eventsByDate.get(dateKey) || [],
      });
    }

    // Next month padding days to complete rows (multiples of 7)
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      days.push({
        date: d,
        isCurrentMonth: false,
        dateKey,
        isToday: isToday(d),
        events: eventsByDate.get(dateKey) || [],
      });
    }

    return days;
  }, [year, month, eventsByDate]);

  const handlePrevMonth = () => {
    const prevDate = new Date(year, month - 1, 1);
    onMonthChange(prevDate.getFullYear(), prevDate.getMonth());
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, month + 1, 1);
    onMonthChange(nextDate.getFullYear(), nextDate.getMonth());
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    onMonthChange(today.getFullYear(), today.getMonth());
  };

  // Jump to the closest event in the calendar
  const handleJumpToNextEvent = () => {
    if (events.length === 0) return;
    const nowMs = new Date().setHours(0, 0, 0, 0);
    const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
    const target = sorted.find((e) => e.start.getTime() >= nowMs) || sorted[0];
    if (target) {
      setSelectedDate(target.start);
      if (
        target.start.getFullYear() !== year ||
        target.start.getMonth() !== month
      ) {
        onMonthChange(target.start.getFullYear(), target.start.getMonth());
      }
      if (onSelectEvent) {
        onSelectEvent(target);
      }
    }
  };

  // Events of selected date
  const pad = (n: number) => String(n).padStart(2, "0");
  const selectedDateKey = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;
  const selectedDateEvents = eventsByDate.get(selectedDateKey) || [];

  return (
    <div className="custom-calendar-container card p-3 p-md-4 border-0">
      {/* Calendar Header with Month/Year Navigation */}
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-light-subtle">
        <div className="d-flex align-items-center gap-2">
          <h4 className="fw-bold mb-0 text-capitalize text-body calendar-month-title">
            {formatCzechMonthYear(currentDate)}
          </h4>
          {isLoadingMonth && (
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Načítání...</span>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary calendar-nav-btn"
            onClick={handleTodayClick}
            title="Přejít na dnešek"
          >
            Dnes
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary calendar-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Předchozí měsíc"
            title="Předchozí měsíc"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary calendar-nav-btn"
            onClick={handleNextMonth}
            aria-label="Následující měsíc"
            title="Následující měsíc"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="calendar-grid-header d-grid text-center mb-2">
        {WEEKDAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={`calendar-weekday fw-semibold small ${
              i >= 5 ? "text-muted opacity-75" : "text-muted"
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="calendar-grid d-grid text-center mb-3">
        {calendarDays.map((dayItem, index) => {
          const isSelected = isSameDay(dayItem.date, selectedDate);
          const hasEvents = dayItem.events.length > 0;

          const cellClasses = [
            "calendar-day-cell",
            !dayItem.isCurrentMonth ? "calendar-day--outside text-muted" : "",
            dayItem.isToday ? "calendar-day--today" : "",
            isSelected ? "calendar-day--selected" : "",
            hasEvents ? "calendar-day--has-events" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const dayTooltip = hasEvents
            ? `${formatCzechFullDate(dayItem.date)}:\n` +
              dayItem.events.map((e) => `• ${e.title}`).join("\n")
            : formatCzechFullDate(dayItem.date);

          return (
            <button
              key={index}
              type="button"
              className={cellClasses}
              onClick={() => {
                setSelectedDate(dayItem.date);
                // If user clicks an outside month day, auto switch to that month
                if (!dayItem.isCurrentMonth) {
                  onMonthChange(
                    dayItem.date.getFullYear(),
                    dayItem.date.getMonth()
                  );
                }
              }}
              title={dayTooltip}
            >
              <span className="calendar-day-number">{dayItem.date.getDate()}</span>
              {hasEvents && (
                <div className="calendar-event-dots">
                  {dayItem.events.slice(0, 3).map((e, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`calendar-event-dot dot-${e.type}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Panel */}
      <div className="calendar-day-details pt-3 border-top border-light-subtle">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="h6 fw-bold mb-0 text-body d-flex align-items-center gap-2">
            <i className="bi bi-calendar-event text-primary"></i>
            <span>
              {formatCzechFullDate(selectedDate)}
            </span>
          </h4>
          {selectedDateEvents.length > 0 && (
            <span className="badge bg-primary-light text-primary rounded-pill small fw-semibold">
              {selectedDateEvents.length}{" "}
              {selectedDateEvents.length === 1
                ? "akce"
                : selectedDateEvents.length < 5
                ? "akce"
                : "akcí"}
            </span>
          )}
        </div>

        {selectedDateEvents.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {selectedDateEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                isSelected={evt.id === selectedEventId}
                onSelect={onSelectEvent}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 px-3 calendar-day-empty">
            <i className="bi bi-calendar-check text-muted fs-4 d-block mb-2"></i>
            <p className="text-muted small mb-3">
              V tento den není naplánována žádná akce.
            </p>
            {events.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1"
                onClick={handleJumpToNextEvent}
              >
                <i className="bi bi-arrow-right-circle"></i>
                <span>Přejít na nejbližší akci</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
