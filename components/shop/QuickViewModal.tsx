import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description?: string;
  inventory: number;
}

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-500"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="aspect-square bg-soft-gray rounded-lg flex items-center justify-center p-8">
                    <span className="text-8xl">{product.image || '🏥'}</span>
                  </div>

                  {/* Product Info */}
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-semibold text-slate-800 mb-2">
                      {product.name}
                    </Dialog.Title>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 ml-2">({product.reviewCount} reviews)</span>
                    </div>

                    <div className="mb-4">
                      {product.salePrice ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-medical-blue">${product.salePrice}</span>
                          <span className="text-lg text-slate-400 line-through">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-slate-800">${product.price}</span>
                      )}
                    </div>

                    <p className="text-slate-600 mb-4">
                      {product.description || 'High-quality medical equipment for professional and home use.'}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-slate-700 w-24">Availability:</span>
                        {product.inventory > 0 ? (
                          <span className="text-subtle-green">In Stock</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </div>
                      {product.inventory > 0 && product.inventory < 10 && (
                        <p className="text-xs text-orange-600">Only {product.inventory} left in stock</p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.inventory === 0}
                        className="flex-1 btn-primary"
                      >
                        Add to Cart
                      </button>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 btn-secondary text-center"
                        onClick={onClose}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
