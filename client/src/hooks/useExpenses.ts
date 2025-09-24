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
} from "@/services/api/expense";
import { ICategory } from "./useCategories";
import { IPaymentMethod } from "./usePaymentMethods";
import { queryKeys } from "@/constants/queryKeys";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { useMemo } from "react";

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentMethods,
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
    hasNextPage,
    fetchNextPage,
    loadingMore: isFetchingNextPage,
    isRefetching: !isLoading && isFetchingNextPage,
  };
}

export type TExpensePerDayRange = "current_week" | "current_month";

export interface IExpensePerDayFilters {
  range?: TExpensePerDayRange;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  paymentMethodId?: number;
}

function getDateRange(range: TExpensePerDayRange) {
  const today = new Date();
  let startDate: string;
  let endDate: string;

  switch (range) {
    case "current_week": {
      startDate = format(startOfWeek(today), "yyyy-MM-dd");
      endDate = format(endOfWeek(today), "yyyy-MM-dd");
      break;
    }
    case "current_month": {
      startDate = format(startOfMonth(today), "yyyy-MM-dd");
      endDate = format(endOfMonth(today), "yyyy-MM-dd");
      break;
    }
    default: {
      startDate = format(today, "yyyy-MM-dd");
      endDate = format(today, "yyyy-MM-dd");
    }
  }

  return { startDate, endDate };
}

export function useExpensesPerDay(filters?: IExpensePerDayFilters) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.expenses, "stats", "per-day", filters],
    queryFn: () => {
      const dateRange = getDateRange(filters?.range ?? "current_week");
      return expenseService.getTotalPerDay({
        ...dateRange,
        ...filters,
      });
    },
    select: (response) => response.data,
  });

  return { expensesPerDay: data, loading: isLoading, error };
}
