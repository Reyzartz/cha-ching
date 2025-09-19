import {
  AppHeader,
  PaymentMethodsList,
  AddPaymentMethodModal,
} from "@/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethods() {
  return (
    <SafeAreaView className="flex-1 items-center">
      <AppHeader />

      <PaymentMethodsList />

      <AddPaymentMethodModal />
    </SafeAreaView>
  );
}
