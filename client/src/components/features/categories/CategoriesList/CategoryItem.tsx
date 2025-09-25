import { memo, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Card } from "@/components/ui";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ICategoryStats } from "@/hooks";

export interface CategoryItemProps {
  category: ICategoryStats;
  onEdit: () => void;
}

const CategoryItem = memo<CategoryItemProps>(({ category, onEdit }) => {
  // Calculate progress (totalAmount / budget), clamp between 0 and 1

  const progress = useMemo(
    () => Math.min(category.totalAmount / category.budget, 1),
    [category.budget, category.totalAmount]
  );

  const progressColor = useMemo(() => {
    if (progress >= 0.9) {
      return "#ef4444"; // red-500
    } else if (progress >= 0.7) {
      return "#facc15"; // yellow-400
    }
    return "#22c55e"; // green-500
  }, [progress]);

  return (
    <Pressable onPress={onEdit}>
      <Card
        className="w-full border border-gray-200 bg-white p-2"
        padding="none"
      >
        <View className="flex-row justify-between items-center w-full mb-1">
          <Text className="font-medium text-gray-900 text-sm" numberOfLines={1}>
            {category.name}
          </Text>
          <Text className="text-sm font-semibold text-blue-600">
            ₹{category.budget.toFixed(2)}
          </Text>
        </View>
        <ProgressBar
          progress={progress}
          height={6}
          color={progressColor}
          style={{ marginTop: 2, marginBottom: 2 }}
        />
        <View className="flex-row justify-between items-center w-full mt-0.5">
          <Text className="text-xs text-gray-400">
            ₹{category.totalAmount.toFixed(2)} spent
          </Text>
          <Text
            className="text-xs font-semibold"
            style={{ color: progressColor }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </Card>
    </Pressable>
  );
});

CategoryItem.displayName = "CategoryItem";

export { CategoryItem };
