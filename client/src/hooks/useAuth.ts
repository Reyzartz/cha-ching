import { useMutation } from "@tanstack/react-query";
import {
  authService,
  ILoginPayload,
  ILoginResponse,
} from "@/services/api/auth";
import { queryClient } from "@/config";
import LocalStorage from "@/utils/LocalStorage";
import { IServerResponse } from "@/services/api/base";
import { router } from "expo-router";
import { NetworkError } from "@/utils/NetworkError";

export function useAuth() {
  const { mutateAsync: login, error } = useMutation<
    IServerResponse<ILoginResponse>,
    NetworkError,
    ILoginPayload
  >({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: async (data) => {
      LocalStorage.setItem(LocalStorage.Keys.AuthToken, data.data.auth_token);

      await queryClient.invalidateQueries();
      router.push("/");
    },
  });

  const logout = async () => {
    await LocalStorage.removeItem(LocalStorage.Keys.AuthToken);
    await queryClient.clear();
    router.replace("/login");
  };

  return {
    login,
    logout,
    error,
  };
}
