import { memo } from "react";
import { Text, View } from "react-native";
import { Card } from "@/components/ui";
import { IPaymentMethod } from "@/hooks";

export interface PaymentMethodItemProps {
  paymentMethod: IPaymentMethod;
}

const PaymentMethodItem = memo<PaymentMethodItemProps>(({ paymentMethod }) => {
  return (
    <Card className="w-full" padding="md">
      <View className="flex-row justify-between items-center gap-4">
        <View className="flex-col gap-1 flex-1">
          <Text className="font-semibold text-gray-900">
            {paymentMethod.name}
          </Text>
        </View>
      </View>
    </Card>
  );
});

PaymentMethodItem.displayName = "PaymentMethodItem";

export { PaymentMethodItem };
