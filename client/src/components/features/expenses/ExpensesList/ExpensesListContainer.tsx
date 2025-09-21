import { memo } from "react";
import { ExpensesList } from ".";
import { View, ActivityIndicator, Text } from "react-native";
import { useExpenses } from "@/hooks";

const ExpensesListContainer = memo(() => {
  const { expenses, loading, error, hasNextPage, fetchNextPage, loadingMore } =
    useExpenses();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ExpensesList
      expenses={expenses}
      onEndReached={handleLoadMore}
      loadingMore={loadingMore}
    />
  );
});

ExpensesListContainer.displayName = "ExpensesListContainer";

export { ExpensesListContainer };
