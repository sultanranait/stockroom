export type ProductStatus = 'active' | 'archived';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  status: ProductStatus;
  created_by: string;
  creator?: { id: string; name: string };
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  status: ProductStatus;
}

export interface ProductListParams {
  page: number;
  limit: number;
  search?: string;
  status?: ProductStatus | '';
}
