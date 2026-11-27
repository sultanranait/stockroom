import ProductForm from '@/components/products/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New product · Stockroom' };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
      <ProductForm />
    </div>
  );
}
