import { ApiClient, IServerResponse } from "./base";

export interface ICategoryAPIData {
  id: number;
  name: string;
}

export interface ICategoryStatsAPIData {
  id: number;
  name: string;
  total_amount: number;
}

export interface ICreateCategoryPayload {
  name: string;
}

export interface IUpdateCategoryPayload {
  id: number;
  name: string;
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

  async getCategoriesStats() {
    return this.get<ICategoryStatsAPIData[]>("/categories/stats");
  }
}

export const categoryService = new CategoryService();
