import { config } from "@/config";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import messagingSystem from "@/utils/Messaging";
import { NetworkError } from "@/utils/NetworkError";
import LocalStorage from "@/utils/LocalStorage";

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
  protected isPublic: boolean;

  constructor({ isPublic = false }: { isPublic?: boolean } = {}) {
    this.isPublic = isPublic;

    this.client = axios.create({
      baseURL: config.api.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: config.api.timeout,
    });

    this.client.interceptors.request.use(async (request) => {
      const token = await LocalStorage.getItem(LocalStorage.Keys.AuthToken);

      if (token && !this.isPublic) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse<IServerResponse<any>>) => {
        return response;
      },
      (responseError: AxiosError<{ error: string }>) => {
        const error = NetworkError.fromAxiosError(responseError);

        if (!this.isPublic && error.isUnauthorized()) {
          messagingSystem.emitUnauthorized();
        }

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

  protected async put<
    T,
    R extends IRelatedItems = IRelatedItems,
    M extends IMetaItems = IMetaItems,
  >(endpoint: string, payload: any): Promise<IServerResponse<T, R, M>> {
    const { data } = await this.client.put<IServerResponse<T, R, M>>(
      endpoint,
      payload
    );

    return data;
  }
}
