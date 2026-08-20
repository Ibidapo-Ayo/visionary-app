import type { DayReading, ProgressRangeKey } from "@/types";

export const getInitials = (
  firstName?: string,
  lastName?: string,
  email?: string,
) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? "";
  const lastInitial = lastName?.trim()?.charAt(0) ?? "";

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? "V").toUpperCase();
};

export const getCurrentSession = (): "morning" | "evening" => {
  const hour = new Date().getHours();
  return hour < 15 ? "morning" : "evening";
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const parseLocalDate = (dateValue: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsedYear = Number(year);
  const parsedMonth = Number(month) - 1;
  const parsedDay = Number(day);
  const parsedDate = new Date(parsedYear, parsedMonth, parsedDay);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getFullYear() !== parsedYear ||
    parsedDate.getMonth() !== parsedMonth ||
    parsedDate.getDate() !== parsedDay
  ) {
    return null;
  }

  return parsedDate;
};

const toUtcDayIndex = (date: Date) =>
  Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);

export const getBibleReadingDayNumber = (startDate: string) => {
  const start = parseLocalDate(startDate);
  if (!start) {
    return null;
  }

  const today = new Date();
  const diffDays = toUtcDayIndex(today) - toUtcDayIndex(start);

  return diffDays + 1; // Adding 1 to make it 1-based instead of 0-based
};

export const formatDayReadingReference = (reading: DayReading) => `${reading.bookName} ${reading.chapter}`;

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDateRangeBounds = (range: ProgressRangeKey) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mondayOffset = (today.getDay() + 6) % 7;
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - mondayOffset);

  switch (range) {
    case "lastWeek": {
      const start = new Date(startOfThisWeek);
      start.setDate(start.getDate() - 7);
      const end = new Date(startOfThisWeek);
      end.setDate(end.getDate() - 1);
      return { start: toDateKey(start), end: toDateKey(end) };
    }
    case "month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: toDateKey(start), end: toDateKey(today) };
    }
    case "year": {
      const start = new Date(today.getFullYear(), 0, 1);
      return { start: toDateKey(start), end: toDateKey(today) };
    }
    case "week":
    default:
      return { start: toDateKey(startOfThisWeek), end: toDateKey(today) };
  }
};

/** Converts a plan-relative day number (1-based) to the calendar date it falls on. */
export const getDateKeyForPlanDay = (planStartDate: string, dayNumber: number) => {
  const start = parseLocalDate(planStartDate);

  if (!start) {
    return "";
  }

  start.setDate(start.getDate() + (dayNumber - 1));
  return toDateKey(start);
};

export const getReadingSubtitle = (references: string[], period: "morning" | "evening", isLoading: boolean) => {
  if (references.length) {
    return references.join(" / ");
  }

  return isLoading ? `Loading ${period} readings...` : `No ${period} reading assigned yet.`;
};
