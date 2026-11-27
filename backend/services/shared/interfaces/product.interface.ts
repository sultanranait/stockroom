export const PRODUCT_STATUSES = ['active', 'archived'] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export interface ProductInput {
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  quantity?: number;
  status?: ProductStatus;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
}
