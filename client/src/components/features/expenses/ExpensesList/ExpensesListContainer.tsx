import { memo, useCallback, useState } from "react";
import { ExpensesList } from ".";
import { View, ActivityIndicator, Text } from "react-native";
import { useExpenses } from "@/hooks";
import { DateRange, DateRangeFilter } from "./DateRangeFilter";

const ExpensesListContainer = memo(() => {
  const [dateRange, setDateRange] = useState<DateRange>({});

  const {
    expenses,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    loadingMore,
    isRefetching,
  } = useExpenses({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

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

  return (
    <View className="w-full items-center p-4 h-full gap-2">
      <View className="flex-row items-center gap-2 self-start">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </View>

      <ExpensesList
        expenses={expenses}
        onEndReached={handleLoadMore}
        loadingMore={loadingMore}
        isRefetching={isRefetching}
      />
    </View>
  );
});

ExpensesListContainer.displayName = "ExpensesListContainer";

export { ExpensesListContainer };
