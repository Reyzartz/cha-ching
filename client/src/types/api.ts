export interface IExpenseAPIData {
  id: number;
  user_id: number;
  category_id: number;
  payment_method_id: number;
  amount: number;
  expense_date: string;
}

export interface ICategoryAPIData {
  id: number;
  name: string;
}

export interface IPaymentMethodAPIData {
  id: number;
  name: string;
}
