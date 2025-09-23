import { memo } from "react";
import { Text } from "react-native";
import { Card } from "@/components/ui";
import { IPaymentMethodStats } from "@/hooks";

export interface PaymentMethodItemProps {
  paymentMethod: IPaymentMethodStats;
}

const PaymentMethodItem = memo<PaymentMethodItemProps>(({ paymentMethod }) => {
  return (
    <Card className="w-full justify-between items-center flex-row" padding="md">
      <Text className="font-semibold text-gray-900">{paymentMethod.name}</Text>

      <Text className="text-lg font-semibold text-blue-500">
        ₹{paymentMethod.totalAmount.toFixed(2)}
      </Text>
    </Card>
  );
});

PaymentMethodItem.displayName = "PaymentMethodItem";

export { PaymentMethodItem };
