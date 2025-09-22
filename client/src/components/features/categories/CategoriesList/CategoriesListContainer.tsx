import { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useCategoriesStats } from "@/hooks";
import { CategoriesList } from ".";

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

  return <CategoriesList categoriesStats={categoriesStats} />;
});

CategoriesListContainer.displayName = "CategoriesListContainer";

export { CategoriesListContainer };
