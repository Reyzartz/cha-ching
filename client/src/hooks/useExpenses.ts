import { useState, useCallback } from "react";
import {
  expenseService,
  ICreateExpensePayload,
  IExpenseAPIData,
} from "@/services/api/expense";
import { ICategory } from "./useCategories";
import { IPaymentMethod } from "./usePaymentMethods";

export interface IExpense {
  id: number;
  userId: number;
  category: ICategory;
  paymentMethod: IPaymentMethod;
  amount: number;
  expenseDate: string;
}

function mapExpenseData(data: IExpenseAPIData): IExpense {
  return {
    id: data.id,
    userId: data.user_id,
    category: {
      id: data.category_id,
      name: "[Placeholder Category Name]", // Placeholder, should be populated from categories data
    },
    paymentMethod: {
      id: data.payment_method_id,
      name: "[Placeholder Payment Method Name]", // Placeholder, should be populated from payment methods data
    },
    amount: data.amount,
    expenseDate: data.expense_date,
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await expenseService.getExpenses();

      setExpenses(data.map(mapExpenseData));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch expenses")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (expense: ICreateExpensePayload) => {
    try {
      setLoading(true);
      setError(null);

      const newExpense = await expenseService.createExpense(expense);

      setExpenses((prev) => [...prev, mapExpenseData(newExpense)]);
      return newExpense;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create expense")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  console.log("Expenses:", expenses);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
  };
}
