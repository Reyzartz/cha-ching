import { IExpenseStatsPerDayAPIData } from "@/services/api";
import React, { useMemo } from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ExpensesBarChartProps {
  data: IExpenseStatsPerDayAPIData[];
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const screenWidth = Dimensions.get("window").width;

const ExpensesBarChart: React.FC<ExpensesBarChartProps> = ({ data }) => {
  const totals = useMemo(() => {
    const totals = Array(7).fill(0);

    data.forEach((item) => {
      if (item?.expense_date) {
        const d = new Date(item.expense_date);
        const weekday = d.getDay();
        totals[weekday] = item.total_amount;
      }
    });

    return totals;
  }, [data]);

  return (
    <View>
      <BarChart
        data={{
          labels: WEEKDAY_LABELS,
          datasets: [{ data: totals }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisLabel="₹"
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 8 },
        }}
        style={{ borderRadius: 8 }}
        showValuesOnTopOfBars
      />
    </View>
  );
};

export default ExpensesBarChart;
