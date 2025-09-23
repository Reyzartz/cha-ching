import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IPaymentMethodStatsAPIData,
  paymentMethodService,
} from "@/services/api/payment-method";
import { ICreatePaymentMethodPayload } from "@/services/api";
import { queryKeys } from "@/constants/queryKeys";

export interface IPaymentMethodStats {
  id: number;
  name: string;
  totalAmount: number;
}

const mapPaymentMethodStats = (
  data: IPaymentMethodStatsAPIData
): IPaymentMethodStats => {
  return {
    id: data.id,
    name: data.name,
    totalAmount: data.total_amount,
  };
};

export function usePaymentMethodsStats() {
  const {
    data: paymentMethodsStats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.paymentMethods, "stats"],
    queryFn: () => paymentMethodService.getPaymentMethodsStats(),
    select: (response) => response.data.map(mapPaymentMethodStats),
  });
  return { paymentMethodsStats, loading: isLoading, error };
}

export interface IPaymentMethod {
  id: number;
  name: string;
}

export function usePaymentMethods() {
  const queryClient = useQueryClient();

  const {
    data: paymentMethods = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.paymentMethods,
    queryFn: () => paymentMethodService.getPaymentMethods(),
    select: (response) => response.data,
  });

  const { mutateAsync: createPaymentMethod } = useMutation({
    mutationFn: (paymentMethod: ICreatePaymentMethodPayload) =>
      paymentMethodService.createPaymentMethod(paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentMethods,
      });
    },
  });

  return {
    paymentMethods,
    loading: isLoading,
    error,
    createPaymentMethod,
  };
}
