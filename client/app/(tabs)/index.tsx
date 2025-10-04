import { AddExpenseModal, ExpensesList, AppHeader } from "@/components";
import { IExpense } from "@/hooks";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const onEditExpense = useCallback((expense: IExpense) => {
    setSelectedExpense(expense);
    setShowExpenseModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowExpenseModal(false);
    setSelectedExpense(null);
  }, []);

  const onOpenModal = useCallback(() => {
    setShowExpenseModal(true);
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center">
      <AppHeader />

      <AddExpenseModal
        key={selectedExpense ? selectedExpense.id : "new"}
        expense={selectedExpense}
        onClose={onCloseModal}
        onOpen={onOpenModal}
        visible={showExpenseModal}
      />

      <ExpensesList onEditExpense={onEditExpense} />
    </SafeAreaView>
  );
}
