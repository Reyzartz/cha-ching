import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IGetPaymentMethodStatsParams,
  IPaymentMethodStatsAPIData,
  paymentMethodService,
} from "@/services/api/payment-method";
import { ICreatePaymentMethodPayload } from "@/services/api";
import { QueryKeys } from "@/constants/queryKeys";
import { getDateRange, TDateRange } from "./utils";

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

interface IUsePaymentMethodsStatsParams
  extends Partial<IGetPaymentMethodStatsParams> {
  range?: TDateRange;
}

export function usePaymentMethodsStats(params: IUsePaymentMethodsStatsParams) {
  const {
    data: paymentMethodsStats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QueryKeys.paymentMethods, "stats"],
    queryFn: () => {
      const dateRange = getDateRange(params.range);
      return paymentMethodService.getPaymentMethodsStats({
        ...dateRange,
        ...params,
      });
    },
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
    queryKey: QueryKeys.paymentMethods,
    queryFn: () => paymentMethodService.getPaymentMethods(),
    select: (response) => response.data,
  });

  const { mutateAsync: createPaymentMethod } = useMutation({
    mutationFn: (paymentMethod: ICreatePaymentMethodPayload) =>
      paymentMethodService.createPaymentMethod(paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.paymentMethods,
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
