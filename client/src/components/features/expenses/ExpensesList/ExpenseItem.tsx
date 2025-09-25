import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { formatINR } from "@/utils/formatINR";
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
    <Card className="w-full border border-gray-200 bg-white p-2" padding="none">
      <View className="flex-row items-center w-full gap-2">
        <View className="w-10 h-10 border border-gray-100 rounded bg-gray-50 items-center justify-center mr-2">
          <Text className="text-xs text-gray-400 text-center px-2">
            {dateLabel}
          </Text>
        </View>
        <View className="flex-1 min-w-0">
          <Text className="font-medium text-gray-900 text-sm" numberOfLines={1}>
            {expense.category?.name}
          </Text>
          <Text className="text-gray-400 text-xs truncate" numberOfLines={1}>
            {expense.title}
          </Text>
        </View>
        <View className="items-end ml-2">
          <Text className="text-sm font-semibold text-red-500">
            {formatINR(expense.amount)}
          </Text>
          <Text className="text-xs text-gray-400" numberOfLines={1}>
            {expense.paymentMethod?.name}
          </Text>
        </View>
      </View>
    </Card>
  );
});

ExpenseItem.displayName = "ExpenseItem";

export { ExpenseItem };
