'use client';

import ProductForm from '@/components/products/ProductForm';
import { useProduct } from '@/hooks/useProducts';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = useProduct(id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>

      {product.isPending ? (
        <p className="text-sm text-slate-500">Loading product…</p>
      ) : product.isError ? (
        <p role="alert" className="text-sm text-red-600">
          {product.error.message}
        </p>
      ) : (
        <ProductForm key={product.data.id} product={product.data} />
      )}
    </div>
  );
}
