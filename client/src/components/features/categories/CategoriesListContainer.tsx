import { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useCategories } from "@/hooks";
import { CategoriesList } from "./CategoriesList";

const CategoriesListContainer = memo(() => {
  const { categories, loading, error } = useCategories();

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

  return <CategoriesList categories={categories} />;
});

CategoriesListContainer.displayName = "CategoriesListContainer";

export { CategoriesListContainer };
