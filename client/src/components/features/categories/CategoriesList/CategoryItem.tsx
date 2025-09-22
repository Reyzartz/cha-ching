import { memo } from "react";
import { Text } from "react-native";
import { Card } from "@/components/ui";
import { ICategoryStats } from "@/hooks";

export interface CategoryItemProps {
  category: ICategoryStats;
}

const CategoryItem = memo<CategoryItemProps>(({ category }) => {
  return (
    <Card className="w-full justify-between items-center flex-row" padding="md">
      <Text className="font-semibold text-gray-900">{category.name}</Text>

      <Text className="text-lg font-semibold text-blue-500">
        ₹{category.totalAmount.toFixed(2)}
      </Text>
    </Card>
  );
});

CategoryItem.displayName = "CategoryItem";

export { CategoryItem };
