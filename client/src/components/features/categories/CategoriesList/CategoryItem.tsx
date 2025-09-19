import { memo } from "react";
import { Text, View } from "react-native";
import { Card } from "@/components/ui";
import { ICategory } from "@/hooks";

export interface CategoryItemProps {
  category: ICategory;
}

const CategoryItem = memo<CategoryItemProps>(({ category }) => {
  return (
    <Card className="w-full" padding="md">
      <View className="flex-row justify-between items-center gap-4">
        <View className="flex-col gap-1 flex-1">
          <Text className="font-semibold text-gray-900">{category.name}</Text>
        </View>
      </View>
    </Card>
  );
});

CategoryItem.displayName = "CategoryItem";

export { CategoryItem };
