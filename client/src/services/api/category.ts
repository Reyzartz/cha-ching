import { ApiClient } from "./base";

export interface ICategoryAPIData {
  id: number;
  name: string;
}

export interface ICreateCategoryPayload {
  name: string;
}

export class CategoryService extends ApiClient {
  async getCategories(): Promise<ICategoryAPIData[]> {
    return this.get<ICategoryAPIData[]>("/categories");
  }

  async createCategory(
    category: ICreateCategoryPayload
  ): Promise<ICategoryAPIData> {
    return this.post<ICategoryAPIData>("/categories", category);
  }
}

export const categoryService = new CategoryService();
