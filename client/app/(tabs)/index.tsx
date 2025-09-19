import { AddExpenseModal, ExpensesList, AppHeader } from "@/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 items-center">
      <AppHeader />

      <AddExpenseModal />

      <ExpensesList />
    </SafeAreaView>
  );
}
