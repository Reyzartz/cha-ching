import React from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { ICategoryStats } from "@/hooks";

interface CategoriesDonutChartProps {
  categoriesStats: ICategoryStats[];
  loading?: boolean;
}

const screenWidth = Dimensions.get("window").width;

const COLORS = [
  "#08306b", // very dark blue
  "#0d47a1",
  "#1565c0",
  "#1976d2",
  "#1e88e5",
  "#2196f3",
  "#42a5f5",
  "#64b5f6",
  "#90caf9",
  "#e3f2fd", // very light blue
];

const WIDTH = screenWidth - 32;
const HEIGHT = 220;

const CategoriesDonutChart: React.FC<CategoriesDonutChartProps> = ({
  categoriesStats,
  loading,
}) => {
  const data = categoriesStats.map((cat, idx) => ({
    name: cat.name,
    population: cat.totalAmount,
    color: COLORS[idx % COLORS.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  return (
    <View
      className="items-center rounded-md bg-white p-4 justify-center"
      style={{ width: WIDTH, height: HEIGHT }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <PieChart
          data={data}
          width={WIDTH}
          height={HEIGHT}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[0, 0]}
          hasLegend={true}
          absolute={false}
          avoidFalseZero
        />
      )}
    </View>
  );
};

export default CategoriesDonutChart;
