import { memo } from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@/components/ui";
import { IPaymentMethodStats } from "@/hooks";
import { PaymentMethodItem } from "./PaymentMethodItem";

export interface PaymentMethodsListProps {
  paymentMethodsStats: IPaymentMethodStats[];
}

const PaymentMethodsList = memo<PaymentMethodsListProps>(
  ({ paymentMethodsStats }) => {
    if (paymentMethodsStats.length === 0) {
      return (
        <Card className="flex-1 justify-center items-center w-full">
          <Text className="text-gray-500 text-lg">No payment methods yet</Text>
          <Text className="text-gray-400 text-sm mt-2">
            Tap the + button to add your first payment method
          </Text>
        </Card>
      );
    }

    return (
      <FlatList
        className="flex-1 w-full px-4"
        data={paymentMethodsStats}
        renderItem={({ item }) => <PaymentMethodItem paymentMethod={item} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    );
  }
);

PaymentMethodsList.displayName = "PaymentMethodsList";

export { PaymentMethodsList };
export { PaymentMethodsListContainer } from "./PaymentMethodsListContainer";
