import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/components/ui";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/utils/formatINR";
import { ICategoryStats } from "@/hooks/useCategories";

interface CategoriesMetaProps {
  categoriesStats: ICategoryStats[];
  loading?: boolean;
}

const CategoriesMeta: React.FC<CategoriesMetaProps> = ({
  categoriesStats,
  loading,
}) => {
  if (loading) {
    return (
      <View className="flex-row justify-center items-center p-3 bg-gray-50 rounded-lg mb-2">
        <Text className="text-gray-400 text-base">Loading...</Text>
      </View>
    );
  }

  const totalCategories = categoriesStats.length;
  const totalBudget = categoriesStats.reduce(
    (sum, cat) => sum + (cat.budget || 0),
    0
  );
  const totalSpent = categoriesStats.reduce(
    (sum, cat) => sum + (cat.totalAmount || 0),
    0
  );
  const progress = totalBudget > 0 ? Math.min(totalSpent / totalBudget, 1) : 0;
  let progressColor = "#22c55e"; // green-500
  if (progress >= 0.9) {
    progressColor = "#ef4444"; // red-500
  } else if (progress >= 0.7) {
    progressColor = "#facc15"; // yellow-400
  }

  return (
    <View className="w-full border-gray-200">
      <Text className="text-xl font-bold text-gray-900 text-center mb-0">
        Categories
      </Text>
      <View className="flex-row justify-center items-center mb-2">
        <Text className="text-base font-semibold text-blue-600 mr-2">
          {totalCategories}
        </Text>
        <Text className="text-sm text-gray-500">categories</Text>
      </View>
      <ProgressBar
        progress={progress}
        height={8}
        color={progressColor}
        style={{
          marginTop: 4,
          marginBottom: 4,
          alignSelf: "center",
          width: "90%",
        }}
      />
      <View className="flex-row justify-center items-center mt-1">
        <Text className="text-sm text-gray-500 mr-2">
          {formatINR(totalSpent)} spent
        </Text>
        <Text className="text-sm text-gray-400 mr-2">
          / {formatINR(totalBudget)} budget
        </Text>
        <Text
          className="text-sm font-semibold"
          style={{ color: progressColor }}
        >
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <Text className="text-xs text-gray-500 text-center mt-2">
        (This data is for the current month only)
      </Text>
    </View>
  );
};

export default CategoriesMeta;
