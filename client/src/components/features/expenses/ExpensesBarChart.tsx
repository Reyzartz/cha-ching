import { useExpensesPerDay } from "@/hooks";
import { TDateRange } from "@/hooks/utils";
import React, { useMemo } from "react";
import { View, Dimensions, ActivityIndicator, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ExpensesBarChartProps {
  categoryId?: number;
  paymentMethodId?: number;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const screenWidth = Dimensions.get("window").width;

const WIDTH = screenWidth - 32;
const HEIGHT = 220;

const ExpensesBarChart: React.FC<ExpensesBarChartProps> = ({
  categoryId,
  paymentMethodId,
}) => {
  const { expensesPerDay, loading } = useExpensesPerDay({
    categoryId,
    paymentMethodId,
  });

  const totals = useMemo(() => {
    const totals = Array(7).fill(0);

    expensesPerDay.forEach((item) => {
      if (item?.expense_date) {
        const d = new Date(item.expense_date);
        const weekday = d.getDay();
        totals[weekday] = item.total_amount;
      }
    });

    return totals;
  }, [expensesPerDay]);

  return (
    <View
      className="flex bg-white justify-center items-center rounded-lg"
      style={{ width: WIDTH, height: HEIGHT + 36 }}
    >
      <Text className="font-semibold self-start text-gray-700 text-lg px-3">
        Expenses This Week
      </Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <BarChart
          data={{
            labels: WEEKDAY_LABELS,
            datasets: [{ data: totals }],
          }}
          width={WIDTH}
          height={HEIGHT}
          yAxisLabel="₹"
          yAxisSuffix=""
          segments={3}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradientOpacity: 1,
            barPercentage: 0.6,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 8 },
          }}
          style={{ borderRadius: 8 }}
          showValuesOnTopOfBars
        />
      )}
    </View>
  );
};

export default ExpensesBarChart;
