export function formatINR(
  amount: number,
  options?: { maximumFractionDigits?: number }
) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: 0,
  });
}
