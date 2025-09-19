import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  expenseService,
  ICreateExpensePayload,
  IExpenseAPIData,
} from "@/services/api/expense";
import { ICategory } from "./useCategories";
import { IPaymentMethod } from "./usePaymentMethods";
import { queryKeys } from "@/constants/queryKeys";

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
  const queryClient = useQueryClient();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.expenses,
    queryFn: async () => {
      const data = await expenseService.getExpenses();
      return data.map(mapExpenseData);
    },
  });

  const { mutateAsync: createExpense } = useMutation({
    mutationFn: async (expense: ICreateExpensePayload) => {
      const newExpense = await expenseService.createExpense(expense);
      return mapExpenseData(newExpense);
    },
    onSuccess: (newExpense) => {
      queryClient.setQueryData<IExpense[]>(
        queryKeys.expenses,
        (oldData = []) => [newExpense, ...oldData]
      );
    },
  });

  return {
    expenses,
    loading: isLoading,
    error,
    createExpense,
  };
}
