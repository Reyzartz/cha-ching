import { QueryClient } from "@tanstack/react-query";

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  cache: {
    staleTime: number;
    gcTime: number;
    retryAttempts: number;
  };
}

export const config: AppConfig = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
    timeout: 10000, // 10 seconds
  },
  cache: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retryAttempts: 1,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.cache.staleTime,
      gcTime: config.cache.gcTime,
      retry: config.cache.retryAttempts,
    },
  },
});
