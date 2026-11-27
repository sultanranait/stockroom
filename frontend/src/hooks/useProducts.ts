import { productService } from '@/services/product.service';
import type { ProductInput, ProductListParams } from '@/types/product';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const useProducts = (params: ProductListParams) => {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => productService.list(params),
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productService.get(id),
  });
};

export const useSaveProduct = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProductInput) =>
      id ? productService.update(id, input) : productService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};
