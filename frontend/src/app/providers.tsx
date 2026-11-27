'use client';

import { ApiError } from '@/lib/api';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          // A missing or expired session sends the user back to the login page
          onError: (error) => {
            if (error instanceof ApiError && error.status === 401) {
              router.replace('/login');
            }
          },
        }),
        defaultOptions: {
          queries: { retry: false, staleTime: 30_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
