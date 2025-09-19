import { memo } from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@/components/ui";
import { ExpenseItem } from "./ExpenseItem";
import { IExpense } from "@/hooks";

export interface ExpensesListProps {
  expenses: IExpense[];
}

const ExpensesList = memo<ExpensesListProps>(({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <Card className="flex-1 justify-center items-center max-w-2xl w-full">
        <Text className="text-gray-500 text-lg">No expenses yet</Text>
        <Text className="text-gray-400 text-sm mt-2">
          Tap the + button to add your first expense
        </Text>
      </Card>
    );
  }

  return (
    <FlatList
      className="flex-1 w-full max-w-2xl px-4"
      data={expenses}
      renderItem={({ item }) => <ExpenseItem expense={item} />}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View className="h-2" />}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
});

ExpensesList.displayName = "ExpensesList";

export { ExpensesList };
export { ExpensesListContainer } from "./ExpensesListContainer";
