import { AppHeader } from "@/components";
import { TDateRange } from "@/hooks/utils";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import { View } from "react-native";
import ExpensesLineChart from "@/components/features/analytics/ExpensesLineChart";
import ExpensesMeta from "@/components/features/analytics/ExpensesMeta";
import CategoriesDonutChart from "@/components/features/analytics/CategoriesDonutChart";
import { useExpensesPerDay } from "@/hooks/useExpenses";
import { useCategoriesStats } from "@/hooks";
// Removed unused Picker import

export default function Analytics() {
  const [range, setRange] = useState<TDateRange>("current_week");
  const {
    expensesPerDay,
    loading: expensesLoading,
    expensesMeta,
  } = useExpensesPerDay({
    range,
  });

  const { categoriesStats, loading: categoriesLoading } = useCategoriesStats({
    range,
  });
  const ranges: { id: TDateRange; name: string }[] = [
    { id: "current_week", name: "This Week" },
    { id: "current_month", name: "This Month" },
    { id: "last_week", name: "Last Week" },
    { id: "last_month", name: "Last Month" },
  ];

  return (
    <View>
      <AppHeader />
      <View className="p-4 gap-2">
        <Select<TDateRange>
          label="Date Range"
          value={range}
          items={ranges}
          onChange={setRange}
          placeholder="Select Range"
        />

        <ExpensesMeta meta={expensesMeta} loading={expensesLoading} />

        <ExpensesLineChart
          expensesPerDay={expensesPerDay}
          range={range}
          loading={expensesLoading}
        />

        <CategoriesDonutChart
          categoriesStats={categoriesStats}
          loading={categoriesLoading}
        />
      </View>
    </View>
  );
}
