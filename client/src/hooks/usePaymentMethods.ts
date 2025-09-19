import { useState, useCallback } from "react";
import { paymentMethodService } from "@/services/api/payment-method";
import { ICreatePaymentMethodPayload } from "@/services/api";

export interface IPaymentMethod {
  id: number;
  name: string;
}

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await paymentMethodService.getPaymentMethods();

      setPaymentMethods(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch payment methods")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaymentMethod = useCallback(
    async (paymentMethod: ICreatePaymentMethodPayload) => {
      try {
        setLoading(true);
        setError(null);
        const newPaymentMethod =
          await paymentMethodService.createPaymentMethod(paymentMethod);
        setPaymentMethods((prev) => [...prev, newPaymentMethod]);
        return newPaymentMethod;
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to create payment method")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
    createPaymentMethod,
  };
}
