import { memo, useEffect, useState } from "react";
import { TExpense, useExpenses } from "@/context/expenses";
import { ExpensesList } from ".";

const ExpensesListContainer = memo(() => {
  const [expenses, setExpenses] = useState<TExpense[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/expenses", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setExpenses(data);
      });
  }, []);

  return <ExpensesList expenses={expenses} />;
});

ExpensesListContainer.displayName = "ExpensesListContainer";

export { ExpensesListContainer };
