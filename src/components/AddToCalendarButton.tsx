import React, { useState, useRef, useEffect } from "react";
import { CalendarEvent } from "../types/calendar";
import {
  createGoogleCalendarUrl,
  downloadIcsFile,
} from "../utils/calendarExport";

interface AddToCalendarButtonProps {
  event: CalendarEvent;
  className?: string;
  size?: "sm" | "md";
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  event,
  className = "",
  size = "sm",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const googleCalUrl = createGoogleCalendarUrl(event);

  const handleDownloadIcs = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadIcsFile(event);
    setIsOpen(false);
  };

  const btnSizeClass = size === "sm" ? "btn-sm py-1 px-2" : "py-2 px-3";

  return (
    <div
      className={`dropdown d-inline-block position-relative ${className}`}
      ref={containerRef}
    >
      <button
        type="button"
        className={`btn btn-outline-primary ${btnSizeClass} d-inline-flex align-items-center gap-1 dropdown-toggle`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Přidat tuto akci do svého kalendáře"
      >
        <i className="bi bi-calendar-plus"></i>
        <span>Přidat do kalendáře</span>
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu show shadow-sm py-2 rounded-3 border-0"
          style={{
            position: "absolute",
            zIndex: 1050,
            left: 0,
            right: "auto",
            minWidth: "220px",
          }}
          role="menu"
        >
          <li>
            <a
              className="dropdown-item d-flex align-items-center gap-2 py-2"
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-google text-danger fs-6"></i>
              <span>Google Kalendář</span>
            </a>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 py-2 text-start w-100 border-0 bg-transparent"
              onClick={handleDownloadIcs}
            >
              <i className="bi bi-apple text-dark fs-6"></i>
              <span>Apple / Outlook (.ics)</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default AddToCalendarButton;
