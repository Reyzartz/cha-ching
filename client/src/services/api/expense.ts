import { ApiClient, IRelatedItems, IServerResponse } from "./base";
import { ICategoryAPIData } from "./category";
import { IPaymentMethodAPIData } from "./payment-method";

export interface IExpenseAPIData {
  id: number;
  user_id: number;
  category_id: number;
  payment_method_id: number;
  title: string;
  amount: number;
  expense_date: string;
}

export interface IExpenseRelatedItems extends IRelatedItems {
  categories: { [key: number]: ICategoryAPIData };
  payment_methods: { [key: number]: IPaymentMethodAPIData };
}

export interface ICreateExpensePayload {
  userId: number;
  categoryId: number;
  paymentMethodId: number;
  title: string;
  amount: number;
  expenseDate: string;
}

export class ExpenseService extends ApiClient {
  async getExpenses(): Promise<
    IServerResponse<IExpenseAPIData[], IExpenseRelatedItems>
  > {
    return this.get<IExpenseAPIData[], IExpenseRelatedItems>("/expenses");
  }

  async createExpense(
    expense: ICreateExpensePayload
  ): Promise<IServerResponse<IExpenseAPIData>> {
    return this.post<IExpenseAPIData>("/expenses", {
      user_id: expense.userId,
      category_id: expense.categoryId,
      payment_method_id: expense.paymentMethodId,
      title: expense.title,
      amount: expense.amount,
      expense_date: expense.expenseDate,
    });
  }
}

export const expenseService = new ExpenseService();
