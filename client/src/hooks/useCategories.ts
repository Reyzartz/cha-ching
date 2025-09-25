// Category stats type (example, adjust as needed)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoryService,
  ICategoryStatsAPIData,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "@/services/api/category";
import { queryKeys } from "@/constants/queryKeys";
export interface ICategoryStats {
  id: number;
  name: string;
  totalAmount: number;
}

const mapCategoryStats = (data: ICategoryStatsAPIData): ICategoryStats => {
  return {
    id: data.id,
    name: data.name,
    totalAmount: data.total_amount,
  };
};

export function useCategoriesStats() {
  const {
    data: categoriesStats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.categories, "stats"],
    queryFn: () => categoryService.getCategoriesStats(),
    select: (response) => response.data.map(mapCategoryStats),
  });
  return { categoriesStats, loading: isLoading, error };
}

export interface ICategory {
  id: number;
  name: string;
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
