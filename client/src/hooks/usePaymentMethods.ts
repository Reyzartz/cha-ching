import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/api/payment-method";
import { ICreatePaymentMethodPayload } from "@/services/api";
import { queryKeys } from "@/constants/queryKeys";

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
  });

  const { mutateAsync: createPaymentMethod } = useMutation({
    mutationFn: (paymentMethod: ICreatePaymentMethodPayload) =>
      paymentMethodService.createPaymentMethod(paymentMethod),
    onSuccess: (newPaymentMethod) => {
      queryClient.setQueryData<IPaymentMethod[]>(
        queryKeys.paymentMethods,
        (oldData = []) => [...oldData, newPaymentMethod]
      );
    },
  });

  return {
    paymentMethods,
    loading: isLoading,
    error,
    createPaymentMethod,
  };
}
