import { Stack } from "expo-router";
import "../styles/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
