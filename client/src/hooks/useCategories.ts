import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoryService,
  ICreateCategoryPayload,
} from "@/services/api/category";
import { queryKeys } from "@/constants/queryKeys";

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

  return {
    categories,
    loading: isLoading,
    error,
    createCategory,
  };
}
