import { ApiClient, IServerResponse } from "./base";

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface ICreateUserResponse {
  id: number;
  name: string;
  email: string;
}

export interface IUserAPIData {
  id: number;
  name: string;
  email: string;
}

class UserService extends ApiClient {
  async createUser(
    payload: ICreateUserPayload
  ): Promise<IServerResponse<ICreateUserResponse>> {
    return this.post<ICreateUserResponse>("/users", payload);
  }

  async getCurrentUser(): Promise<IServerResponse<IUserAPIData>> {
    return this.get<IUserAPIData>("/users/current");
  }
}

export const userService = new UserService();
