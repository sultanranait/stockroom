'use client';

import Button, { buttonClass } from '@/components/ui/Button';
import Field, { controlClass } from '@/components/ui/Field';
import { useSaveProduct } from '@/hooks/useProducts';
import { fieldErrors } from '@/lib/api';
import type { Product, ProductStatus } from '@/types/product';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

const describedBy = (id: string, error?: string) =>
  error ? `${id}-error` : undefined;

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const save = useSaveProduct(product?.id);
  const errors = fieldErrors(save.error);
  const hasFieldErrors = Object.keys(errors).length > 0;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    save.mutate(
      {
        name: String(form.get('name')),
        sku: String(form.get('sku')),
        description: String(form.get('description')),
        price: Number(form.get('price')),
        quantity: Number(form.get('quantity')),
        status: form.get('status') as ProductStatus,
      },
      { onSuccess: () => router.push('/products') },
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      {save.error && !hasFieldErrors && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {save.error.message}
        </p>
      )}

      <Field id="name" label="Name" error={errors.name}>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={150}
          defaultValue={product?.name}
          className={controlClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy('name', errors.name)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sku" label="SKU" error={errors.sku}>
          <input
            id="sku"
            name="sku"
            required
            pattern="[A-Za-z0-9\-]{3,64}"
            defaultValue={product?.sku}
            className={`${controlClass} font-mono uppercase`}
            aria-invalid={Boolean(errors.sku)}
            aria-describedby={describedBy('sku', errors.sku)}
          />
        </Field>

        <Field id="status" label="Status" error={errors.status}>
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? 'active'}
            className={controlClass}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={describedBy('status', errors.status)}
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </Field>

        <Field id="price" label="Price (USD)" error={errors.price}>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            defaultValue={product?.price}
            className={controlClass}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={describedBy('price', errors.price)}
          />
        </Field>

        <Field id="quantity" label="Quantity" error={errors.quantity}>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            min="0"
            step="1"
            defaultValue={product?.quantity ?? 0}
            className={controlClass}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={describedBy('quantity', errors.quantity)}
          />
        </Field>
      </div>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={product?.description ?? ''}
          className={controlClass}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={describedBy('description', errors.description)}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Link href="/products" className={buttonClass('secondary')}>
          Cancel
        </Link>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? 'Saving…' : product ? 'Save changes' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
