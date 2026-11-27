import Button, { buttonClass } from '@/components/ui/Button';
import type { Product } from '@/types/product';
import Link from 'next/link';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

interface ProductTableProps {
  products: Product[];
  canDelete: boolean;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  canDelete,
  onDelete,
}: ProductTableProps) {
  if (!products.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
        No products match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium tracking-wide text-slate-500 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3">
              SKU
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Qty
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="min-w-48 px-4 py-3">
                <div className="font-medium text-slate-900">{product.name}</div>
                {product.creator && (
                  <div className="text-xs text-slate-500">
                    Added by {product.creator.name}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-slate-600">
                {product.sku}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                {currency.format(product.price)}
              </td>
              <td
                className={`px-4 py-3 text-right tabular-nums ${product.quantity === 0 ? 'font-medium text-red-600' : ''}`}
              >
                {product.quantity}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    product.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  href={`/products/${product.id}/edit`}
                  className={buttonClass('secondary')}
                  aria-label={`Edit ${product.name}`}
                >
                  Edit
                </Link>
                {canDelete && (
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
