import React, { useMemo } from "react";
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
  const labels = useMemo(() => {
    const today = new Date();
    const start =
      range === "current_week" ? startOfWeek(today) : startOfMonth(today);
    const end = range === "current_week" ? endOfWeek(today) : endOfMonth(today);

    switch (range) {
      case "current_week":
        return eachDayOfInterval({
          start,
          end,
        }).map((date) => format(date, "EEE"));
      case "current_month":
        return eachDayOfInterval({
          start,
          end,
        }).map((date) => format(date, "d MMM"));
      default:
        return [];
    }
  }, [range]);

  const amounts = useMemo(() => {
    const amountMap: Record<string, number> = {};
    expensesPerDay.forEach((item) => {
      if (item.expense_date) {
        const date = new Date(item.expense_date);
        const label =
          range === "current_week"
            ? format(date, "EEE")
            : format(date, "d MMM");
        amountMap[label] = item.total_amount;
      }
    });

    return labels.map((label) => amountMap[label] || 0);
  }, [expensesPerDay, labels, range]);

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
          hidePointsAtIndex={
            range === "current_month"
              ? amounts
                  .map((_, idx) => (idx % 6 === 0 ? -1 : idx))
                  .filter((idx) => idx !== -1)
              : []
          }
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
