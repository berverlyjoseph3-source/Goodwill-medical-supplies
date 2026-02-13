import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface InventoryAlertProps {
  products: any[];
}

export const InventoryAlert = ({ products }: InventoryAlertProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Low Stock Alert</h2>
          <p className="text-sm text-slate-600">
            {products.length} products need attention
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-slate-600">All products are well stocked!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center justify-between p-3 bg-soft-gray rounded-lg hover:bg-gray-200 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate group-hover:text-medical-blue">
                  {product.name}
                </p>
                <p className="text-xs text-slate-500">
                  SKU: {product.sku}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-bold text-red-600">
                  {product.inventory} left
                </p>
                <p className="text-xs text-slate-500">
                  Min: 10
                </p>
              </div>
            </Link>
          ))}
          
          <Link
            href="/admin/products?filter=low-stock"
            className="block text-center text-sm text-medical-blue hover:text-medical-blue-dark font-medium mt-4"
          >
            View all low stock products
          </Link>
        </div>
      )}
    </div>
  );
};
