import { authService } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => (await authService.me()).user,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: ({ user }) => queryClient.setQueryData(['me'], user),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => queryClient.clear(),
  });
};
