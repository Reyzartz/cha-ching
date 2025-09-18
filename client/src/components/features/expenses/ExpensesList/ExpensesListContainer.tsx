import { memo } from "react";
import { useExpenses } from "@/context/expenses";
import { ExpensesList } from ".";
import { View, ActivityIndicator, Text } from "react-native";

const ExpensesListContainer = memo(() => {
  const { expenses, isLoading, error } = useExpenses();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return <ExpensesList expenses={expenses} />;
});

ExpensesListContainer.displayName = "ExpensesListContainer";

export { ExpensesListContainer };
