import { ApiClient, IServerResponse } from "./base";

export interface IPaymentMethodAPIData {
  id: number;
  name: string;
}

export interface IPaymentMethodStatsAPIData {
  id: number;
  name: string;
  total_amount: number;
}

export interface ICreatePaymentMethodPayload {
  name: string;
}

export interface IGetPaymentMethodStatsParams {
  startDate: string;
  endDate: string;
}

export class PaymentMethodService extends ApiClient {
  async getPaymentMethods(): Promise<IServerResponse<IPaymentMethodAPIData[]>> {
    return this.get<IPaymentMethodAPIData[]>("/payment-methods");
  }

  async createPaymentMethod(
    paymentMethod: ICreatePaymentMethodPayload
  ): Promise<IServerResponse<IPaymentMethodAPIData>> {
    return this.post<IPaymentMethodAPIData>("/payment-methods", paymentMethod);
  }

  async getPaymentMethodsStats(
    params: IGetPaymentMethodStatsParams
  ): Promise<IServerResponse<IPaymentMethodStatsAPIData[]>> {
    const queryParams = new URLSearchParams();
    queryParams.set("start_date", params.startDate);
    queryParams.set("end_date", params.endDate);

    return this.get<IPaymentMethodStatsAPIData[]>(
      `/payment-methods/stats?${queryParams.toString()}`
    );
  }
}

export const paymentMethodService = new PaymentMethodService();
