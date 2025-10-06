import { useMutation } from "@tanstack/react-query";
import {
  userService,
  ICreateUserPayload,
  ICreateUserResponse,
} from "@/services/api/user";
import { queryClient } from "@/config";
import { IServerResponse } from "@/services/api/base";
import { NetworkError } from "@/utils/NetworkError";
import { router } from "expo-router";

export function useUser() {
  const { mutateAsync: createUser, error } = useMutation<
    IServerResponse<ICreateUserResponse>,
    NetworkError,
    ICreateUserPayload
  >({
    mutationFn: (payload) => userService.createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.push("/login");
    },
  });

  return {
    createUser,
    error,
  };
}
