import { memo } from "react";
import { Text, View } from "react-native";
import { formatINR } from "@/utils/formatINR";
import { Card } from "@/components/ui";
import { IPaymentMethodStats } from "@/hooks";

export interface PaymentMethodItemProps {
  paymentMethod: IPaymentMethodStats;
}

const PaymentMethodItem = memo<PaymentMethodItemProps>(({ paymentMethod }) => {
  return (
    <Card className="w-full border border-gray-200 bg-white p-2" padding="none">
      <View className="flex-row justify-between items-center w-full mb-1">
        <Text className="font-medium text-gray-900 text-sm" numberOfLines={1}>
          {paymentMethod.name}
        </Text>
        <Text className="text-sm font-semibold text-blue-600">
          {formatINR(paymentMethod.totalAmount)}
        </Text>
      </View>
    </Card>
  );
});

PaymentMethodItem.displayName = "PaymentMethodItem";

export { PaymentMethodItem };
