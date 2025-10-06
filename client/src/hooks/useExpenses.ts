import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  expenseService,
  ICreateExpensePayload,
  IExpenseAPIData,
  IExpenseMetaItems,
  IExpenseRelatedItems,
  IGetExpensesParams,
  IGetExpenseStatsPerDayParams,
  IUpdateExpensePayload,
} from "@/services/api/expense";
import { ICategory } from "./useCategories";
import { IPaymentMethod } from "./usePaymentMethods";
import { QueryKeys } from "@/constants/queryKeys";
import { useMemo } from "react";
import { getDateRange, TDateRange } from "./utils";

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
    queryKey: [...QueryKeys.expenses, filters],
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
        queryKey: QueryKeys.expenses,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.categories,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.paymentMethods,
      });
    },
  });

  const { mutateAsync: updateExpense } = useMutation({
    mutationFn: ({
      id,
      expense,
    }: {
      id: number;
      expense: IUpdateExpensePayload;
    }) => expenseService.updateExpense(id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.expenses,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.categories,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.paymentMethods,
      });
    },
  });

  const expenses = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const expensesMeta = useMemo<IExpenseMetaItems>(() => {
    return (
      data?.pages[0]?.meta ?? {
        total_amount: 0,
        total_count: 0,
      }
    );
  }, [data]);

  return {
    expenses,
    expensesMeta,
    loading: isLoading,
    error,
    createExpense,
    updateExpense,
    hasNextPage,
    fetchNextPage,
    loadingMore: isFetchingNextPage,
    isRefetching: !isLoading && isFetchingNextPage,
  };
}

export interface IExpensePerDayFilters
  extends Partial<IGetExpenseStatsPerDayParams> {
  range?: TDateRange;
}

export function useExpensesPerDay(filters?: IExpensePerDayFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QueryKeys.expenses, "stats", "per-day", filters],
    queryFn: () => {
      const dateRange = getDateRange(filters?.range);
      return expenseService.getTotalPerDay({
        ...dateRange,
        ...filters,
      });
    },
  });

  return {
    expensesPerDay: data?.data ?? [],
    expensesMeta: data?.meta ?? {},
    loading: isLoading,
    error,
  };
}
