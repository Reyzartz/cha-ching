import { ApiClient } from "./base";

export interface IExpenseAPIData {
  id: number;
  user_id: number;
  category_id: number;
  payment_method_id: number;
  amount: number;
  expense_date: string;
}

export interface ICreateExpensePayload {
  userId: number;
  categoryId: number;
  paymentMethodId: number;
  amount: number;
  expenseDate: string;
}

export class ExpenseService extends ApiClient {
  async getExpenses(): Promise<IExpenseAPIData[]> {
    return this.get<IExpenseAPIData[]>("/expenses");
  }

  async createExpense(
    expense: ICreateExpensePayload
  ): Promise<IExpenseAPIData> {
    return this.post<IExpenseAPIData>("/expenses", {
      user_id: expense.userId,
      category_id: expense.categoryId,
      payment_method_id: expense.paymentMethodId,
      amount: expense.amount,
      expense_date: expense.expenseDate,
    });
  }
}

export const expenseService = new ExpenseService();
