import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  expenseService,
  ICreateExpensePayload,
  IExpenseAPIData,
  IExpenseRelatedItems,
} from "@/services/api/expense";
import { ICategory } from "./useCategories";
import { IPaymentMethod } from "./usePaymentMethods";
import { queryKeys } from "@/constants/queryKeys";

export interface IExpense {
  id: number;
  userId: number;
  categoryId: number;
  paymentMethodId: number;
  category: ICategory | null;
  paymentMethod: IPaymentMethod | null;
  amount: number;
  expenseDate: string;
}

function mapExpenseData(
  data: IExpenseAPIData,
  relatedItems: Partial<IExpenseRelatedItems> = {}
): IExpense {
  return {
    id: data.id,
    userId: data.user_id,
    categoryId: data.category_id,
    paymentMethodId: data.payment_method_id,
    category: relatedItems["categories"]?.[data.category_id] ?? null,
    paymentMethod:
      relatedItems["payment_methods"]?.[data.payment_method_id] ?? null,
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
    queryFn: async () => expenseService.getExpenses(),
    select: ({ data, related_items }) =>
      data.map((item) => mapExpenseData(item, related_items)),
  });

  const { mutateAsync: createExpense } = useMutation({
    mutationFn: (expense: ICreateExpensePayload) =>
      expenseService.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses,
      });
    },
  });

  return {
    expenses,
    loading: isLoading,
    error,
    createExpense,
  };
}
