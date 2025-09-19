import { ApiClient } from "./base";

export interface IPaymentMethodAPIData {
  id: number;
  name: string;
}

export interface ICreatePaymentMethodPayload {
  name: string;
}

export class PaymentMethodService extends ApiClient {
  async getPaymentMethods(): Promise<IPaymentMethodAPIData[]> {
    return this.get<IPaymentMethodAPIData[]>("/payment-methods");
  }

  async createPaymentMethod(
    paymentMethod: ICreatePaymentMethodPayload
  ): Promise<IPaymentMethodAPIData> {
    return this.post<IPaymentMethodAPIData>("/payment-methods", paymentMethod);
  }
}

export const paymentMethodService = new PaymentMethodService();
