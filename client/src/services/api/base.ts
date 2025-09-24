import { config } from "@/config";
import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface IRelatedItems {
  [key: string]: {
    [key: number]: Record<string, any>;
  };
}

export interface IMetaItems {
  [key: string]: any;
}

export interface IPaginationData {
  total_pages: number;
  current_page: number;
  items_per_page: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface IServerResponse<
  T,
  R extends IRelatedItems = IRelatedItems,
  M extends IMetaItems = IMetaItems,
> {
  data: T;
  error?: string;
  related_items?: R;
  pagination?: IPaginationData;
  meta?: M;
}

export class ApiClient {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse<IServerResponse<any>>) => {
        const serverResponse = response.data;
        if (!ApiClient.isSuccessResponse(response)) {
          return Promise.reject(new Error(serverResponse.error));
        }

        return response;
      },
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  static isSuccessResponse(
    response: AxiosResponse<IServerResponse<any>>
  ): boolean {
    return (
      response.status >= 200 && response.status < 300 && !response.data.error
    );
  }

  protected async get<
    T,
    R extends IRelatedItems = IRelatedItems,
    M extends IMetaItems = IMetaItems,
  >(endpoint: string): Promise<IServerResponse<T, R, M>> {
    const { data } = await this.client.get<IServerResponse<T, R, M>>(endpoint);

    return data;
  }

  protected async post<
    T,
    R extends IRelatedItems = IRelatedItems,
    M extends IMetaItems = IMetaItems,
  >(endpoint: string, payload: any): Promise<IServerResponse<T, R, M>> {
    const { data } = await this.client.post<IServerResponse<T, R, M>>(
      endpoint,
      payload
    );

    return data;
  }
}
