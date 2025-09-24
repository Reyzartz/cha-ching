import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { ICategoryStats } from "@/hooks";

interface CategoriesDonutChartProps {
  categoriesStats: ICategoryStats[];
}

const screenWidth = Dimensions.get("window").width;

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF",
  "#B2FF66",
  "#FF66B2",
  "#66B2FF",
];

const CategoriesDonutChart: React.FC<CategoriesDonutChartProps> = ({
  categoriesStats,
}) => {
  const data = categoriesStats.map((cat, idx) => ({
    name: cat.name,
    population: cat.totalAmount,
    color: COLORS[idx % COLORS.length],
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  return (
    <View className="items-center rounded-md bg-white p-4">
      <PieChart
        data={data}
        width={screenWidth - 32}
        height={220}
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
    </View>
  );
};

export default CategoriesDonutChart;
