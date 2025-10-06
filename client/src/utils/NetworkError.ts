import { AxiosError } from "axios";

export class NetworkError {
  static StatusCode = {
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500,
  };

  constructor(
    readonly message: string,
    readonly statusCode: number
  ) {}

  static fromAxiosError(error: AxiosError<{ error: string }>): NetworkError {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unknown network error occurred";
    const statusCode = error.response?.status || 0;
    return new NetworkError(message, statusCode);
  }

  isUnauthorized() {
    return this.statusCode === NetworkError.StatusCode.Unauthorized;
  }

  isForbidden() {
    return this.statusCode === NetworkError.StatusCode.Forbidden;
  }

  isNotFound() {
    return this.statusCode === NetworkError.StatusCode.NotFound;
  }

  isServerError() {
    return this.statusCode === NetworkError.StatusCode.InternalServerError;
  }
}
