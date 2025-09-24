import { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useCategoriesStats } from "@/hooks";
import { CategoriesList } from ".";
import CategoriesDonutChart from "../CategoriesDonutChart";

const CategoriesListContainer = memo(() => {
  const { categoriesStats, loading, error } = useCategoriesStats();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CategoriesDonutChart categoriesStats={categoriesStats} />
      <CategoriesList categoriesStats={categoriesStats} />
    </View>
  );
});

CategoriesListContainer.displayName = "CategoriesListContainer";

export { CategoriesListContainer };
