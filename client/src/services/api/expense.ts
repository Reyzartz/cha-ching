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

export interface IExpenseMetaItems {
  total_count: number;
  total_amount: number;
}

export interface IExpenseStatsPerDayAPIData {
  expense_date: string;
  count: number;
  total_amount: number;
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

export interface IGetExpensesParams {
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  paymentMethodId?: number;
}

export interface IGetExpenseStatsPerDayParams {
  startDate: string;
  endDate: string;
  categoryId?: number;
  paymentMethodId?: number;
}

export class ExpenseService extends ApiClient {
  async getExpenses(
    params: IGetExpensesParams = {}
  ): Promise<
    IServerResponse<IExpenseAPIData[], IExpenseRelatedItems, IExpenseMetaItems>
  > {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.startDate) queryParams.set("start_date", params.startDate);
    if (params.endDate) queryParams.set("end_date", params.endDate);
    if (params.categoryId)
      queryParams.set("category_id", params.categoryId.toString());
    if (params.paymentMethodId)
      queryParams.set("payment_method_id", params.paymentMethodId.toString());

    return this.get<IExpenseAPIData[], IExpenseRelatedItems, IExpenseMetaItems>(
      `/expenses?${queryParams.toString()}`
    );
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

  async getTotalPerDay({
    startDate,
    endDate,
    categoryId,
    paymentMethodId,
  }: IGetExpenseStatsPerDayParams): Promise<
    IServerResponse<IExpenseStatsPerDayAPIData[], never, IExpenseMetaItems>
  > {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.set("start_date", startDate);
    if (endDate) queryParams.set("end_date", endDate);
    if (categoryId) queryParams.set("category_id", categoryId.toString());
    if (paymentMethodId)
      queryParams.set("payment_method_id", paymentMethodId.toString());

    return this.get<IExpenseStatsPerDayAPIData[], never, IExpenseMetaItems>(
      `/expenses/stats/total-per-day?${queryParams.toString()}`
    );
  }
}

export const expenseService = new ExpenseService();
