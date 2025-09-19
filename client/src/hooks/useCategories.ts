import { useState, useCallback } from "react";
import {
  categoryService,
  ICreateCategoryPayload,
} from "@/services/api/category";

export interface ICategory {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await categoryService.getCategories();

      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (category: ICreateCategoryPayload) => {
      try {
        setLoading(true);
        setError(null);

        const newCategory = await categoryService.createCategory(category);

        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to create category")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
  };
}
