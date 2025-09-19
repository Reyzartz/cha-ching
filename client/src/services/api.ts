import { TCategory, TExpense, TPaymentMethod } from "@/context/expenses";
import {
  ICategoryAPIData,
  IExpenseAPIData,
  IPaymentMethodAPIData,
} from "@/types/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ServerResponse<T> {
  data: T;
  error?: string;
}

// Convert server response to client model
function mapExpense(expense: IExpenseAPIData): TExpense {
  return {
    id: expense.id,
    userId: expense.user_id,
    categoryId: expense.category_id,
    paymentMethodId: expense.payment_method_id,
    amount: expense.amount,
    expenseDate: expense.expense_date,
  };
}

function mapCategory(category: ICategoryAPIData): TCategory {
  return {
    id: category.id,
    name: category.name,
  };
}

function mapPaymentMethod(method: IPaymentMethodAPIData): TPaymentMethod {
  return {
    id: method.id,
    name: method.name,
  };
}

async function fetchApi<T, U = T>(
  endpoint: string,
  options?: RequestInit,
  mapper?: (data: T) => U
): Promise<U> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data, error } = (await response.json()) as ServerResponse<T>;

    if (error) {
      throw new Error(error);
    }

    return mapper ? mapper(data) : (data as unknown as U);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const expenseApi = {
  getExpenses: () =>
    fetchApi<IExpenseAPIData[], TExpense[]>("/expenses", undefined, (data) =>
      data.map(mapExpense)
    ),

  createExpense: (expense: Omit<TExpense, "id">) =>
    fetchApi<IExpenseAPIData, TExpense>(
      "/expenses",
      {
        method: "POST",
        body: JSON.stringify({
          user_id: expense.userId,
          category_id: expense.categoryId,
          payment_method_id: expense.paymentMethodId,
          amount: expense.amount,
          expense_date: expense.expenseDate,
        }),
      },
      mapExpense
    ),

  getCategories: () =>
    fetchApi<ICategoryAPIData[], TCategory[]>(
      "/categories",
      undefined,
      (data) => data.map(mapCategory)
    ),

  createCategory: (category: Omit<TCategory, "id">) =>
    fetchApi<ICategoryAPIData, TCategory>(
      "/categories",
      {
        method: "POST",
        body: JSON.stringify(category),
      },
      mapCategory
    ),

  getPaymentMethods: () =>
    fetchApi<IPaymentMethodAPIData[], TPaymentMethod[]>(
      "/payment-methods",
      undefined,
      (data) => data.map(mapPaymentMethod)
    ),

  createPaymentMethod: (paymentMethod: Omit<TPaymentMethod, "id">) =>
    fetchApi<IPaymentMethodAPIData, TPaymentMethod>(
      "/payment-methods",
      {
        method: "POST",
        body: JSON.stringify(paymentMethod),
      },
      mapPaymentMethod
    ),
};
