import { memo, useCallback, useState } from "react";
import { ExpensesList } from "../ExpensesList";
import { View, ActivityIndicator, Text, ScrollView } from "react-native";
import { useExpenses, useCategories, usePaymentMethods } from "@/hooks";
import { DateRange, DateRangeFilter } from "./DateRangeFilter";
import { Select } from "@/components/ui/Select";
import ExpensesLineChart from "../ExpensesLineChart";

const ExpensesListContainer = memo(() => {
  const [dateRange, setDateRange] = useState<DateRange>({});

  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [paymentMethodId, setPaymentMethodId] = useState<number | undefined>();

  const { categories } = useCategories();
  const { paymentMethods } = usePaymentMethods();

  const {
    expenses,
    expensesMeta,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    loadingMore,
    isRefetching,
  } = useExpenses({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    categoryId,
    paymentMethodId,
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
    <View className="w-full items-start p-4 h-full gap-2">
      <Text className="font-bold text-4xl text-gray-700 text-center mb-2">
        ₹{expensesMeta.total_amount.toFixed(2)}
      </Text>

      <ExpensesLineChart paymentMethodId={paymentMethodId} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0 self-start"
        contentContainerClassName="items-center gap-2"
      >
        <Select
          value={categoryId}
          items={[{ id: 0, name: "All Categories" }, ...categories]}
          placeholder="All Categories"
          onChange={(id) => setCategoryId(id === 0 ? undefined : id)}
        />

        <Select
          value={paymentMethodId}
          items={[{ id: 0, name: "All Methods" }, ...paymentMethods]}
          placeholder="All Methods"
          onChange={(id) => setPaymentMethodId(id === 0 ? undefined : id)}
        />

        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </ScrollView>

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
