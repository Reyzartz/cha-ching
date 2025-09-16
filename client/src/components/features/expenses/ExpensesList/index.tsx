import { memo } from "react";
import { View, Text } from "react-native";
import { TExpense } from "@/context/expenses";
import { Card } from "@/components/ui";
import { ExpenseItem } from "./ExpenseItem";

export interface ExpensesListProps {
  expenses: TExpense[];
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
    <View className="flex-1 gap-2 p-4 w-full max-w-2xl">
      {expenses.map((expense, index) => (
        <ExpenseItem key={`${expense.name}-${index}`} expense={expense} />
      ))}
    </View>
  );
});

ExpensesList.displayName = "ExpensesList";

export { ExpensesList };
export { ExpensesListContainer } from "./ExpensesListContainer";
