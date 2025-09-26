import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

export type TDateRange = "current_week" | "current_month";

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
    default: {
      startDate = format(today, "yyyy-MM-dd");
      endDate = format(today, "yyyy-MM-dd");
    }
  }

  return { startDate, endDate };
}
