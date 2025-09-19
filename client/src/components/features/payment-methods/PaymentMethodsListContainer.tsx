import { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { usePaymentMethods } from "@/hooks";
import { PaymentMethodsList } from "./PaymentMethodsList";

const PaymentMethodsListContainer = memo(() => {
  const { paymentMethods, loading, error } = usePaymentMethods();

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

  return <PaymentMethodsList paymentMethods={paymentMethods} />;
});

PaymentMethodsListContainer.displayName = "PaymentMethodsListContainer";

export { PaymentMethodsListContainer };
