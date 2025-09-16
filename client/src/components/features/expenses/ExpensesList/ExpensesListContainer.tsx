import { memo } from "react";
import { useExpenses } from "@/context/expenses";
import { ExpensesList } from ".";

const ExpensesListContainer = memo(() => {
  const { expenses } = useExpenses();

  return <ExpensesList expenses={expenses} />;
});

ExpensesListContainer.displayName = "ExpensesListContainer";

export { ExpensesListContainer };
