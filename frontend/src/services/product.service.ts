import { api } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { Product, ProductInput, ProductListParams } from '@/types/product';

const productUrl = (id: string) => `/api/products/${encodeURIComponent(id)}`;

export const productService = {
  list: ({ page, limit, search, status }: ProductListParams) => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) query.set('search', search);
    if (status) query.set('status', status);

    return api.get<Paginated<Product>>(`/api/products?${query}`);
  },
  get: (id: string) => api.get<Product>(productUrl(id)),
  create: (input: ProductInput) => api.post<Product>('/api/products', input),
  update: (id: string, input: ProductInput) =>
    api.patch<Product>(productUrl(id), input),
  remove: (id: string) => api.delete<null>(productUrl(id)),
};
