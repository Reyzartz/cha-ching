import { ApiClient, IServerResponse } from "./base";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  auth_token: string;
}

class AuthService extends ApiClient {
  async login(
    payload: ILoginPayload
  ): Promise<IServerResponse<ILoginResponse>> {
    return this.post<ILoginResponse>("/tokens/authenticate", payload);
  }
}

export const authService = new AuthService({
  isPublic: true,
});
