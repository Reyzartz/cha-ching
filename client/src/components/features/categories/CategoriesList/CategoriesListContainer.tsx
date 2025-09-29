import { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { ICategory, useCategoriesStats } from "@/hooks";
import { CategoriesList } from ".";

interface ICategoriesListContainerProps {
  onEditCategory: (category: ICategory) => void;
}

const CategoriesListContainer = memo(
  ({ onEditCategory }: ICategoriesListContainerProps) => {
    const { categoriesStats, loading, error } = useCategoriesStats({
      
    });

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
        <CategoriesList
          categoriesStats={categoriesStats}
          onEditCategory={onEditCategory}
        />
      </View>
    );
  }
);

CategoriesListContainer.displayName = "CategoriesListContainer";

export { CategoriesListContainer };
