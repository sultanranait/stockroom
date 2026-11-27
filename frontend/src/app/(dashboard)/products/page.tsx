'use client';

import ProductTable from '@/components/products/ProductTable';
import Button, { buttonClass } from '@/components/ui/Button';
import { controlClass } from '@/components/ui/Field';
import { useCurrentUser } from '@/hooks/useAuth';
import { useDeleteProduct, useProducts } from '@/hooks/useProducts';
import type { Product, ProductStatus } from '@/types/product';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProductStatus | ''>('');

  const { data: user } = useCurrentUser();
  const products = useProducts({ page, limit: PAGE_SIZE, search, status });
  const deleteProduct = useDeleteProduct();
  const pagination = products.data?.pagination;

  const onFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setSearch(String(form.get('search')).trim());
    setStatus(form.get('status') as ProductStatus | '');
    setPage(1);
  };

  const onDelete = (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) {
      return;
    }

    deleteProduct.mutate(product.id, {
      onSuccess: () => {
        // Step back when the last item on a page is removed
        if (products.data?.items.length === 1 && page > 1) setPage(page - 1);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pagination ? `${pagination.total} in total` : ' '}
          </p>
        </div>
        <Link href="/products/new" className={buttonClass()}>
          New product
        </Link>
      </div>

      <form onSubmit={onFilter} role="search" className="flex flex-wrap gap-2">
        <div className="w-full sm:w-72">
          <label htmlFor="search" className="sr-only">
            Search by name or SKU
          </label>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search by name or SKU"
            defaultValue={search}
            className={controlClass}
          />
        </div>
        <div className="w-40">
          <label htmlFor="status-filter" className="sr-only">
            Status
          </label>
          <select
            id="status-filter"
            name="status"
            defaultValue={status}
            className={controlClass}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <Button type="submit" variant="secondary">
          Apply
        </Button>
      </form>

      {deleteProduct.error && (
        <p role="alert" className="text-sm text-red-600">
          {deleteProduct.error.message}
        </p>
      )}

      {products.isPending ? (
        <p className="text-sm text-slate-500">Loading products…</p>
      ) : products.isError ? (
        <p role="alert" className="text-sm text-red-600">
          {products.error.message}
        </p>
      ) : (
        <ProductTable
          products={products.data.items}
          canDelete={user?.role === 'admin'}
          onDelete={onDelete}
        />
      )}

      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between text-sm text-slate-600"
        >
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
