import React, { useCallback, useMemo } from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { TDateRange } from "@/hooks/utils";
import { IExpenseStatsPerDayAPIData } from "@/services/api";

interface ExpensesLineChartProps {
  expensesPerDay: IExpenseStatsPerDayAPIData[];
  range: TDateRange;
  loading: boolean;
}

const screenWidth = Dimensions.get("window").width;

const WIDTH = screenWidth - 32;
const HEIGHT = 220;

const ExpensesLineChart: React.FC<ExpensesLineChartProps> = ({
  range,
  expensesPerDay,
  loading,
}) => {
  const formatDateLabel = useCallback(
    (date: Date) => {
      switch (range) {
        case "current_week":
        case "last_week":
          return format(date, "EEE");
        case "current_month":
        case "last_month":
          return format(date, "d MMM");
        default:
          return date.toDateString();
      }
    },
    [range]
  );

  const labels = useMemo(() => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (range) {
      case "current_week":
        start = startOfWeek(today);
        end = endOfWeek(today);
        return eachDayOfInterval({ start, end }).map(formatDateLabel);
      case "last_week": {
        const lastWeekStart = startOfWeek(
          new Date(today.setDate(today.getDate() - 7))
        );
        const lastWeekEnd = endOfWeek(lastWeekStart);
        return eachDayOfInterval({
          start: lastWeekStart,
          end: lastWeekEnd,
        }).map(formatDateLabel);
      }
      case "current_month":
        start = startOfMonth(today);
        end = endOfMonth(today);
        return eachDayOfInterval({ start, end }).map(formatDateLabel);

      case "last_month": {
        const lastMonthDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastMonthStart = startOfMonth(lastMonthDate);
        const lastMonthEnd = endOfMonth(lastMonthDate);
        return eachDayOfInterval({
          start: lastMonthStart,
          end: lastMonthEnd,
        }).map(formatDateLabel);
      }

      default:
        return [];
    }
  }, [formatDateLabel, range]);

  const amounts = useMemo(() => {
    const amountMap: Record<string, number> = {};
    expensesPerDay.forEach((item) => {
      if (item.expense_date) {
        const date = new Date(item.expense_date);
        let label: string;
        switch (range) {
          case "current_week":
          case "last_week":
            label = formatDateLabel(date);
            break;
          case "current_month":
          case "last_month":
            label = formatDateLabel(date);
            break;
          default:
            label = "";
        }
        amountMap[label] = item.total_amount;
      }
    });

    return labels.map((label) => amountMap[label] || 0);
  }, [expensesPerDay, formatDateLabel, labels, range]);

  const hidePointsAtIndex = useMemo(() => {
    switch (range) {
      case "current_month":
      case "last_month":
        return amounts
          .map((_, idx) => (idx % 6 === 0 ? -1 : idx))
          .filter((idx) => idx !== -1);

      default:
        return [];
    }
  }, [amounts, range]);

  return (
    <View
      className="relative bg-white rounded-lg justify-center items-center"
      style={{ width: WIDTH, height: HEIGHT + 36 }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <LineChart
          data={{
            labels,
            datasets: [{ data: amounts }],
          }}
          width={screenWidth - 32}
          height={220}
          segments={3}
          fromZero
          withDots={false}
          yAxisInterval={100000}
          withVerticalLines={false}
          formatYLabel={(y) => {
            const value = Number(y);
            return value > 1000
              ? `${(value / 1000).toFixed(0)}K`
              : value.toFixed(0);
          }}
          hidePointsAtIndex={hidePointsAtIndex}
          yAxisLabel="₹"
          bezier
          transparent
          chartConfig={{
            backgroundColor: "transparent",
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ borderRadius: 8 }}
        />
      )}
    </View>
  );
};

export default ExpensesLineChart;
