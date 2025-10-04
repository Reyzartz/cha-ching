import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

export type TDateRange =
  | "current_week"
  | "current_month"
  | "last_week"
  | "last_month";

export function getDateRange(range: TDateRange = "current_week") {
  const today = new Date();
  let startDate: string;
  let endDate: string;

  switch (range) {
    case "current_week": {
      startDate = format(startOfWeek(today), "yyyy-MM-dd");
      endDate = format(endOfWeek(today), "yyyy-MM-dd");
      break;
    }
    case "current_month": {
      startDate = format(startOfMonth(today), "yyyy-MM-dd");
      endDate = format(endOfMonth(today), "yyyy-MM-dd");
      break;
    }
    case "last_week": {
      const lastWeekStart = startOfWeek(
        new Date(today.setDate(today.getDate() - 7))
      );
      const lastWeekEnd = endOfWeek(lastWeekStart);
      startDate = format(lastWeekStart, "yyyy-MM-dd");
      endDate = format(lastWeekEnd, "yyyy-MM-dd");
      break;
    }
    case "last_month": {
      const lastMonthDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      startDate = format(startOfMonth(lastMonthDate), "yyyy-MM-dd");
      endDate = format(endOfMonth(lastMonthDate), "yyyy-MM-dd");
      break;
    }
  }

  return { startDate, endDate };
}
