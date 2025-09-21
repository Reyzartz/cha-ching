import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  expenseService,
  ICreateExpensePayload,
  IExpenseAPIData,
  IExpenseRelatedItems,
  IGetExpensesParams,
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
  title: string;
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
    title: data.title,
    amount: data.amount,
    expenseDate: data.expense_date,
  };
}

export interface IExpenseFilters
  extends Omit<IGetExpensesParams, "page" | "limit"> {}

const ITEMS_PER_PAGE = 10;

export function useExpenses(filters?: IExpenseFilters) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...queryKeys.expenses, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await expenseService.getExpenses({
        page: pageParam,
        limit: ITEMS_PER_PAGE,
        ...filters,
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextPage = lastPage.pagination?.next_page ?? null;
      return hasNextPage;
    },
    select: (data) => ({
      pages: data.pages.map((page) => ({
        ...page,
        data: page.data.map((item) => mapExpenseData(item, page.related_items)),
      })),
      pageParams: data.pageParams,
    }),
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

  const expenses = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    expenses,
    loading: isLoading,
    error,
    createExpense,
    hasNextPage,
    fetchNextPage,
    loadingMore: isFetchingNextPage,
    isRefetching: !isLoading && isFetchingNextPage,
  };
}
