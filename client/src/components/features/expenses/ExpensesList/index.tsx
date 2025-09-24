import { memo } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Card } from "@/components/ui";
import { ExpenseItem } from "./ExpenseItem";
import { IExpense } from "@/hooks";

export interface ExpensesListProps {
  expenses: IExpense[];
  onEndReached?: () => void;
  loadingMore?: boolean;
  isRefetching?: boolean;
}

const LoadingIndicator = () => (
  <View className="py-4">
    <ActivityIndicator />
  </View>
);

const ExpensesList = memo<ExpensesListProps>(
  ({ expenses, onEndReached, loadingMore, isRefetching }) => {
    if (expenses.length === 0 && !isRefetching) {
      return (
        <Card className="flex-1 justify-center items-center w-full">
          <Text className="text-gray-500 text-lg">No expenses yet</Text>
          <Text className="text-gray-400 text-sm mt-2">
            Tap the + button to add your first expense
          </Text>
        </Card>
      );
    }

    return (
      <FlatList
        className="flex-1 w-full"
        data={expenses}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore || isRefetching ? LoadingIndicator : undefined
        }
      />
    );
  }
);

ExpensesList.displayName = "ExpensesList";

export { ExpensesList };
