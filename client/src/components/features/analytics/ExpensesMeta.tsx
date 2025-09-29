import React from "react";
import { View, Text } from "react-native";
import { IExpenseMetaItems } from "@/services/api/expense";
import { formatINR } from "@/utils/formatINR";

interface ExpensesMetaProps {
  meta: Partial<IExpenseMetaItems>;
  loading?: boolean;
}

const ExpensesMeta: React.FC<ExpensesMetaProps> = ({ meta, loading }) => {
  if (loading) {
    return (
      <View className="flex-row justify-center items-center p-3 bg-gray-50 rounded-lg mb-2">
        <Text className="text-gray-400 text-base">Loading...</Text>
      </View>
    );
  }
  return (
    <View className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
      <View>
        <Text className="text-xs text-gray-500">Total Expenses</Text>
        <Text className="text-lg font-bold text-gray-800">
          {meta.total_count}
        </Text>
      </View>
      <View>
        <Text className="text-xs text-gray-500">Total Amount</Text>
        <Text className="text-lg font-bold text-gray-800">
          {formatINR(meta?.total_amount ?? 0)}
        </Text>
      </View>
    </View>
  );
};

export default ExpensesMeta;
