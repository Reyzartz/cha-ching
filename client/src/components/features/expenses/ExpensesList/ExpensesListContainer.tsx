import { memo, useCallback, useMemo, useState } from "react";
import { formatINR } from "@/utils/formatINR";
import { ExpensesList } from "../ExpensesList";
import { View, ActivityIndicator, Text } from "react-native";
import {
  useExpenses,
  useCategories,
  usePaymentMethods,
  IExpense,
} from "@/hooks";
import { DateRange, DateRangeFilter } from "./DateRangeFilter";
import { Select } from "@/components/ui/Select";
import { Accordion } from "@/components/ui";
import { format } from "date-fns";
import ExpensesBarChart from "../ExpensesBarChart";

interface IExpensesListContainerProps {
  onEditExpense: (expense: IExpense) => void;
}

const ExpensesListContainer = memo(
  ({ onEditExpense }: IExpensesListContainerProps) => {
    const [dateRange, setDateRange] = useState<DateRange>({});
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [paymentMethodId, setPaymentMethodId] = useState<
      number | undefined
    >();
    const [filtersOpen, setFiltersOpen] = useState(true);

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

    const selectedCategory = useMemo(() => {
      if (categoryId) {
        return categories.find((c) => c.id === categoryId);
      }
    }, [categoryId, categories]);

    const selectedPaymentMethod = useMemo(() => {
      if (paymentMethodId) {
        return paymentMethods.find((m) => m.id === paymentMethodId);
      }
    }, [paymentMethodId, paymentMethods]);

    const dateRangeLabel = useMemo(() => {
      if (dateRange.startDate && dateRange.endDate) {
        return `${format(new Date(dateRange.startDate), "d MMM")} - ${format(
          new Date(dateRange.endDate),
          "d MMM"
        )}`;
      }

      return "All Time";
    }, [dateRange.startDate, dateRange.endDate]);

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
      <View className="w-full items-start p-4 h-full gap-2 bg-slate-100">
        <ExpensesBarChart
          categoryId={categoryId}
          paymentMethodId={paymentMethodId}
        />

        <Text className="font-semibold text-gray-700 text-xl">
          Total: {formatINR(expensesMeta.total_amount)}
        </Text>

        <Accordion
          open={filtersOpen}
          onToggle={setFiltersOpen}
          collapsedHeight={0}
          expandedHeight={100}
          title={filtersOpen ? "Hide Filters" : ""}
          summary={
            !filtersOpen && (
              <>
                <Text className="text-xs px-2 py-0.5 bg-gray-100 rounded-full mr-1 text-gray-700">
                  {selectedCategory?.name || "All Categories"}
                </Text>
                <Text className="text-xs px-2 py-0.5 bg-gray-100 rounded-full mr-1 text-gray-700">
                  {selectedPaymentMethod?.name || "All Methods"}
                </Text>
                <Text className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                  {dateRangeLabel}
                </Text>
              </>
            )
          }
        >
          <View className="flex-row w-full gap-2 mb-2">
            <Select
              value={categoryId}
              items={[{ id: 0, name: "All Categories" }, ...categories]}
              placeholder="All Categories"
              onChange={(id) => setCategoryId(id === 0 ? undefined : id)}
              className="flex-1"
            />
            <Select
              value={paymentMethodId}
              items={[{ id: 0, name: "All Methods" }, ...paymentMethods]}
              placeholder="All Methods"
              onChange={(id) => setPaymentMethodId(id === 0 ? undefined : id)}
              className="flex-1"
            />
          </View>

          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </Accordion>

        <ExpensesList
          expenses={expenses}
          onEndReached={handleLoadMore}
          loadingMore={loadingMore}
          isRefetching={isRefetching}
          onEditExpense={onEditExpense}
        />
      </View>
    );
  }
);

ExpensesListContainer.displayName = "ExpensesListContainer";

export { ExpensesListContainer };
