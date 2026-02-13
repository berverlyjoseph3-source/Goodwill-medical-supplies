import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { 
  TrashIcon, 
  ChevronRightIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import { useCartStore } from '../stores/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { motion } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-padding max-w-7xl mx-auto py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-soft-gray rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBagIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Your cart is empty
            </h1>
            <p className="text-slate-600 mb-8">
              Looks like you haven't added any medical equipment to your cart yet.
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push('/checkout');
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="bg-soft-gray border-y border-gray-200">
        <div className="container-padding max-w-7xl mx-auto py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-medical-blue">Home</Link></li>
            <li><ChevronRightIcon className="w-4 h-4 text-slate-400" /></li>
            <li><Link href="/shop" className="text-slate-600 hover:text-medical-blue">Shop</Link></li>
            <li><ChevronRightIcon className="w-4 h-4 text-slate-400" /></li>
            <li className="text-slate-800 font-medium">Shopping Cart</li>
          </ol>
        </div>
      </nav>

      <div className="container-padding max-w-7xl mx-auto py-8 lg:py-12">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 bg-soft-gray flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-slate-600 hover:text-red-600 flex items-center space-x-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Clear Cart</span>
                </button>
                <Link
                  href="/shop"
                  className="text-sm text-medical-blue hover:text-medical-blue-dark font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary
                subtotal={subtotal}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
