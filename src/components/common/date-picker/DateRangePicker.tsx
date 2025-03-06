"use client";

import { Calendar } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateRangePickerProps = {
  onChange?: (dateRange: DateRange) => void;
  initialDateRange?: DateRange;
  placeholder?: string;
};

const DateRangePicker = ({
  onChange,
  initialDateRange,
  placeholder = "DD / MM / YYYY - DD / MM / YYYY",
}: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: initialDateRange?.startDate || null,
    endDate: initialDateRange?.endDate || null,
  });
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<ReactDatePicker>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize input value based on initial date range
  useEffect(() => {
    if (initialDateRange?.startDate || initialDateRange?.endDate) {
      setInputValue(formatDateDisplay());
    } else {
      setInputValue("");
    }
  }, [initialDateRange?.startDate, initialDateRange?.endDate]); // Added dependencies

  // Update input value when date range changes from calendar selection
  useEffect(() => {
    if (dateRange.startDate || dateRange.endDate) {
      setInputValue(formatDateDisplay());
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    const newDateRange = { startDate: start, endDate: end };
    setDateRange(newDateRange);

    if (onChange) {
      onChange(newDateRange);
    }
  };

  const formatDateDisplay = () => {
    if (dateRange.startDate || dateRange.endDate) {
      const startFormatted = dateRange.startDate
        ? formatDate(dateRange.startDate)
        : "DD / MM / YYYY";

      const endFormatted = dateRange.endDate
        ? formatDate(dateRange.endDate)
        : "DD / MM / YYYY";

      return `${startFormatted} - ${endFormatted}`;
    }

    return "";
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day} / ${month} / ${year}`;
  };

  const parseDate = (dateStr: string) => {
    // Parse date in DD / MM / YYYY format
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const day = Number.parseInt(parts[0].trim(), 10);
      const month = Number.parseInt(parts[1].trim(), 10) - 1; // Month is 0-indexed
      const year = Number.parseInt(parts[2].trim(), 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const date = new Date(year, month, day);
        // Validate the date is real (e.g., not Feb 31)
        if (
          date.getDate() === day &&
          date.getMonth() === month &&
          date.getFullYear() === year
        ) {
          return date;
        }
      }
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse the input value as a date range
    const rangeParts = value.split("-");
    if (rangeParts.length === 2) {
      const startDate = parseDate(rangeParts[0]);
      const endDate = parseDate(rangeParts[1]);

      const newDateRange = {
        startDate,
        endDate,
      };

      // Only update if we have valid dates
      if (startDate || endDate) {
        setDateRange(newDateRange);

        if (onChange) {
          onChange(newDateRange);
        }
      }
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
    if (!isOpen && datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="date-range-picker-container" ref={containerRef}>
      <div className="date-range-input-wrapper">
        <input
          type="text"
          className="date-range-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
        />
        <Calendar
          className="date-range-calendar-icon"
          onClick={toggleDatePicker}
        />
      </div>
      <ReactDatePicker
        ref={datePickerRef}
        selected={dateRange.startDate}
        onChange={handleDateChange}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        selectsRange
        monthsShown={1}
        open={isOpen}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        customInput={<></>} // Hidden input
        popperClassName="date-range-popper"
        calendarClassName="date-range-calendar"
      />
    </div>
  );
};

export default DateRangePicker;
