import { memo } from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@/components/ui";
import { ICategory } from "@/hooks";
import { CategoryItem } from "./CategoryItem";

export interface CategoriesListProps {
  categories: ICategory[];
}

const CategoriesList = memo<CategoriesListProps>(({ categories }) => {
  if (categories.length === 0) {
    return (
      <Card className="flex-1 justify-center items-center max-w-2xl w-full">
        <Text className="text-gray-500 text-lg">No categories yet</Text>
        <Text className="text-gray-400 text-sm mt-2">
          Tap the + button to add your first category
        </Text>
      </Card>
    );
  }

  return (
    <FlatList
      className="flex-1 w-full max-w-2xl px-4"
      data={categories}
      renderItem={({ item }) => <CategoryItem category={item} />}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View className="h-2" />}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
});

CategoriesList.displayName = "CategoriesList";

export { CategoriesList };
export { CategoriesListContainer } from "./CategoriesListContainer";
