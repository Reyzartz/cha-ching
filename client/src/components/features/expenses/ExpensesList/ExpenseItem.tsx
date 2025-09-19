import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { Card } from "@/components/ui";
import { IExpense } from "@/hooks";

export interface ExpenseItemProps {
  expense: IExpense;
}

const ExpenseItem = memo<ExpenseItemProps>(({ expense }) => {
  const dateLabel = useMemo(() => {
    const date = new Date(expense.expenseDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }, [expense.expenseDate]);

  return (
    <Card className="w-full" padding="md">
      <View className="flex-row justify-between items-center gap-4">
        <View className="flex-col gap-1 flex-1">
          <Text className="font-semibold text-gray-900">
            {expense.category.name}
          </Text>

          <Text className="text-sm text-gray-500">
            {expense.paymentMethod.name}
          </Text>
        </View>

        <View className="flex-col items-end gap-1">
          <Text className="text-lg font-semibold text-red-500">
            ₹{expense.amount}
          </Text>
          <Text className="text-gray-400 text-xs">{dateLabel}</Text>
        </View>
      </View>
    </Card>
  );
});

ExpenseItem.displayName = "ExpenseItem";

export { ExpenseItem };
