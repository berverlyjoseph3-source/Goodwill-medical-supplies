import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProductsPageProps {
  products: any[];
  totalCount: number;
}

export default function ProductsPage({ products: initialProducts, totalCount }: ProductsPageProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/products?search=${searchQuery}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    
    // Sort products locally
    const sorted = [...products].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortOrder === 'asc' 
          ? (aVal || 0) - (bVal || 0)
          : (bVal || 0) - (aVal || 0);
      }
    });
    
    setProducts(sorted);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' 
      ? <ArrowUpIcon className="w-4 h-4 ml-1" />
      : <ArrowDownIcon className="w-4 h-4 ml-1" />;
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Products
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your product inventory ({totalCount} total)
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="btn-primary inline-flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Product
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, SKU, or brand..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue-dark 
                         transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-soft-gray">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort('sku')}
                    >
                      <div className="flex items-center">
                        SKU
                        <SortIcon field="sku" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center">
                        Price
                        <SortIcon field="price" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort('inventory')}
                    >
                      <div className="flex items-center">
                        Stock
                        <SortIcon field="inventory" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-soft-gray/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 bg-soft-gray rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 font-mono">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">
                          ${product.salePrice || product.price}
                        </div>
                        {product.salePrice && (
                          <div className="text-xs text-slate-400 line-through">
                            ${product.price}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${product.inventory > 20 ? 'bg-green-100 text-green-700' :
                            product.inventory > 10 ? 'bg-yellow-100 text-yellow-700' :
                            product.inventory > 0 ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                          {product.inventory > 0 ? `${product.inventory} units` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-slate-600 hover:text-medical-blue transition-colors"
                            title="Edit product"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                            title="Delete product"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-soft-gray rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CubeIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No products found
                </h3>
                <p className="text-slate-600 mb-6">
                  Get started by adding your first product
                </p>
                <Link
                  href="/admin/products/new"
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add New Product
                </Link>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalCount = await prisma.product.count();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      totalCount,
    },
  };
}
