import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Card } from "@/components/ui";
import { ICategoryStats } from "@/hooks";

export interface CategoryItemProps {
  category: ICategoryStats;
  onEdit: () => void;
}

const CategoryItem = memo<CategoryItemProps>(({ category, onEdit }) => {
  return (
    <Pressable onPress={onEdit}>
      <Card
        className="w-full justify-between items-center flex-row"
        padding="md"
      >
        <Text className="font-semibold text-gray-900">{category.name}</Text>

        <Text className="text-lg font-semibold text-blue-500">
          ₹{category.totalAmount.toFixed(2)}
        </Text>
      </Card>
    </Pressable>
  );
});

CategoryItem.displayName = "CategoryItem";

export { CategoryItem };
