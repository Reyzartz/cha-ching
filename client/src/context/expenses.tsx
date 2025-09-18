import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { expenseApi } from "@/services/api";

interface ExpensesContext {
  isLoading: boolean;
  error: string | null;
  expenses: TExpense[];
  categories: TCategory[];
  paymentMethods: TPaymentMethod[];
  addExpense: (expense: Omit<TExpense, "id">) => Promise<void>;
  addCategory: (category: Omit<TCategory, "id">) => Promise<void>;
  addPaymentMethod: (
    paymentMethod: Omit<TPaymentMethod, "id">
  ) => Promise<void>;
}

export type TCategory = {
  id: number;
  name: string;
};

export type TPaymentMethod = {
  id: number;
  name: string;
};

export type TExpense = {
  id: number;
  userId: number;
  categoryId: number;
  paymentMethodId: number;
  amount: number;
  expenseDate: string;
  // Include category and payment method data for UI
  category?: TCategory;
  paymentMethod?: TPaymentMethod;
};

const ExpenseContext = createContext<ExpensesContext>({
  isLoading: false,
  error: null,
  expenses: [],
  categories: [],
  paymentMethods: [],
  addExpense: async () => {},
  addCategory: async () => {},
  addPaymentMethod: async () => {},
});

const ExpensesProvider = memo(({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<TPaymentMethod[]>([]);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [expensesRes, categoriesRes, paymentMethodsRes] = await Promise.all(
        [
          expenseApi.getExpenses(),
          expenseApi.getCategories(),
          expenseApi.getPaymentMethods(),
        ]
      );

      // Enrich expenses with category and payment method data
      const enrichedExpenses = expensesRes.map((expense) => ({
        ...expense,
        category: categoriesRes.find((cat) => cat.id === expense.categoryId),
        paymentMethod: paymentMethodsRes.find(
          (pm) => pm.id === expense.paymentMethodId
        ),
      }));

      setExpenses(enrichedExpenses);
      setCategories(categoriesRes);
      setPaymentMethods(paymentMethodsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExpense = useCallback(
    async (expense: Omit<TExpense, "id">) => {
      try {
        const data = await expenseApi.createExpense(expense);
        // Enrich the new expense with category and payment method data
        const enrichedExpense = {
          ...data,
          category: categories.find((cat) => cat.id === data.categoryId),
          paymentMethod: paymentMethods.find(
            (pm) => pm.id === data.paymentMethodId
          ),
        };
        setExpenses((prev) => [...prev, enrichedExpense]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create expense"
        );
        throw err;
      }
    },
    [categories, paymentMethods]
  );

  const addCategory = useCallback(async (category: Omit<TCategory, "id">) => {
    try {
      const data = await expenseApi.createCategory(category);
      setCategories((prev) => [...prev, data]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
      throw err;
    }
  }, []);

  const addPaymentMethod = useCallback(
    async (paymentMethod: Omit<TPaymentMethod, "id">) => {
      try {
        const data = await expenseApi.createPaymentMethod(paymentMethod);
        setPaymentMethods((prev) => [...prev, data]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create payment method"
        );
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <ExpenseContext.Provider
      value={{
        isLoading,
        error,
        expenses,
        categories,
        paymentMethods,
        addExpense,
        addCategory,
        addPaymentMethod,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
});

ExpensesProvider.displayName = "ExpensesProvider";

const useExpenses = () => {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used within a ExpensesProvider");
  }

  return context;
};

export { ExpensesProvider, useExpenses };
