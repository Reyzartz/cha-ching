// Category stats type (example, adjust as needed)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoryService,
  ICategoryStatsAPIData,
  ICreateCategoryPayload,
  IGetCategoryStatsParams,
  IUpdateCategoryPayload,
} from "@/services/api/category";
import { queryKeys } from "@/constants/queryKeys";
import { getDateRange, TDateRange } from "./utils";
export interface ICategoryStats {
  id: number;
  name: string;
  budget: number;
  totalAmount: number;
}

const mapCategoryStats = (data: ICategoryStatsAPIData): ICategoryStats => {
  return {
    id: data.id,
    name: data.name,
    budget: data.budget,
    totalAmount: data.total_amount,
  };
};

interface IUseCategoriesStatsParams extends Partial<IGetCategoryStatsParams> {
  range?: TDateRange;
}

export function useCategoriesStats(params: IUseCategoriesStatsParams) {
  const {
    data: categoriesStats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.categories, "stats"],
    queryFn: () => {
      const dateRange = getDateRange(params.range);
      return categoryService.getCategoriesStats({ ...dateRange, ...params });
    },
    select: (response) => response.data.map(mapCategoryStats),
  });
  return { categoriesStats, loading: isLoading, error };
}

export interface ICategory {
  id: number;
  name: string;
  budget: number;
}

export function useCategories() {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoryService.getCategories(),
    select: (response) => response.data,
  });

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: (category: ICreateCategoryPayload) =>
      categoryService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories,
      });
    },
  });

  const { mutateAsync: updateCategory } = useMutation({
    mutationFn: (category: IUpdateCategoryPayload) =>
      categoryService.updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories,
      });
    },
  });

  return {
    categories,
    loading: isLoading,
    error,
    updateCategory,
    createCategory,
  };
}
