import { useMutation, useQuery } from "@tanstack/react-query";
import {
  userService,
  ICreateUserPayload,
  ICreateUserResponse,
  IUserAPIData,
} from "@/services/api/user";
import { queryClient } from "@/config";
import { IServerResponse } from "@/services/api/base";
import { NetworkError } from "@/utils/NetworkError";
import { router } from "expo-router";
import { QueryKeys } from "@/constants/queryKeys";

export interface IUser {
  id: number;
  name: string;
  email: string;
}

const mapUser = (data: IUserAPIData): IUser => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  };
};

export function useCurrentUser() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: QueryKeys.currentUser,
    queryFn: () => userService.getCurrentUser(),
    select: (response) => mapUser(response.data),
  });

  return { user, loading: isLoading, error };
}

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
