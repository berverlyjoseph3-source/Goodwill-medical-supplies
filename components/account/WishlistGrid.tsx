import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';

interface WishlistGridProps {
  items: any[];
}

export const WishlistGrid = ({ items }: WishlistGridProps) => {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: any) => {
    // ✅ FIXED: Added inventory property (required by CartItem type)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity: 1,
      inventory: product.inventory || 0, // <-- ADD THIS LINE
      // slug: product.slug,  // <-- REMOVED
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleRemove = async (productId: number) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Removed from wishlist');
        // Refresh the page
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-soft-gray rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <HeartIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-slate-600 mb-6">
          Save your favorite items here
        </p>
        <Link href="/shop" className="btn-primary inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((product) => (
        <div
          key={product.id}
          className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <Link href={`/product/${product.slug}`} className="block relative">
            <div className="aspect-square relative bg-soft-gray">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>

          <div className="p-4">
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-medium text-slate-900 mb-2 group-hover:text-medical-blue transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-slate-900">
                ${product.salePrice || product.price}
              </span>
              {product.salePrice && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 btn-primary text-sm py-2"
              >
                <ShoppingCartIcon className="w-4 h-4 mr-2 inline-block" />
                Add to Cart
              </button>
              <button
                onClick={() => handleRemove(product.id)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                aria-label="Remove from wishlist"
              >
                <TrashIcon className="w-5 h-5 text-slate-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};