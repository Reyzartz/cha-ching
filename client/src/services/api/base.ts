import { config } from "@/config";
import axios, { AxiosInstance, AxiosResponse } from "axios";

interface ServerResponse<T> {
  data: T;
  error?: string;
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
      (response: AxiosResponse<ServerResponse<any>>) => {
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
    response: AxiosResponse<ServerResponse<any>>
  ): boolean {
    return (
      response.status >= 200 && response.status < 300 && !response.data.error
    );
  }

  protected async get<T>(endpoint: string): Promise<T> {
    const {
      data: { data },
    } = await this.client.get<ServerResponse<T>>(endpoint);

    return data;
  }

  protected async post<T>(endpoint: string, payload: any): Promise<T> {
    const {
      data: { data },
    } = await this.client.post<ServerResponse<T>>(endpoint, payload);

    return data;
  }
}
