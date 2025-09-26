import { ApiClient, IServerResponse } from "./base";

export interface ICategoryAPIData {
  id: number;
  name: string;
  budget: number;
}

export interface IGetCategoryStatsParams {
  startDate: string;
  endDate: string;
}

export interface ICategoryStatsAPIData {
  id: number;
  name: string;
  budget: number;
  total_amount: number;
}

export interface ICreateCategoryPayload {
  name: string;
  budget: number;
}

export interface IUpdateCategoryPayload {
  id: number;
  name: string;
  budget: number;
}

export class CategoryService extends ApiClient {
  async getCategories(): Promise<IServerResponse<ICategoryAPIData[]>> {
    return this.get<ICategoryAPIData[]>("/categories");
  }

  async createCategory(
    category: ICreateCategoryPayload
  ): Promise<IServerResponse<ICategoryAPIData>> {
    return this.post<ICategoryAPIData>("/categories", category);
  }

  async updateCategory(
    category: IUpdateCategoryPayload
  ): Promise<IServerResponse<ICategoryAPIData>> {
    return this.put<ICategoryAPIData>("/categories", category);
  }

  async getCategoriesStats({ startDate, endDate }: IGetCategoryStatsParams) {
    const queryParams = new URLSearchParams();
    queryParams.set("start_date", startDate);
    queryParams.set("end_date", endDate);

    return this.get<ICategoryStatsAPIData[]>(
      `/categories/stats?${queryParams.toString()}`
    );
  }
}

export const categoryService = new CategoryService();
