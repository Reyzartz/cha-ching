import { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { usePaymentMethodsStats } from "@/hooks";
import { PaymentMethodsList } from ".";

const PaymentMethodsListContainer = memo(() => {
  const { paymentMethodsStats, loading, error } = usePaymentMethodsStats({
    range: "current_month",
  });

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

  return <PaymentMethodsList paymentMethodsStats={paymentMethodsStats} />;
});

PaymentMethodsListContainer.displayName = "PaymentMethodsListContainer";

export { PaymentMethodsListContainer };
