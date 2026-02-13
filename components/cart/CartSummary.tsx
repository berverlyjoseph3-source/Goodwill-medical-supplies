import { useState } from 'react';
import { ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export const CartSummary = ({ subtotal, onCheckout, isCheckingOut = false }: CartSummaryProps) => {
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium text-slate-900">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Estimated Tax</span>
          <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
        </div>
        
        {shipping > 0 && (
          <p className="text-xs text-slate-500">
            Free shipping on orders over $500
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-semibold text-slate-900">Total</span>
          <span className="text-xl font-bold text-medical-blue">${total.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {isCheckingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Proceed to Checkout</span>
          )}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <ShieldCheckIcon className="w-4 h-4 text-medical-blue flex-shrink-0" />
          <span>Secure checkout with Stripe</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <TruckIcon className="w-4 h-4 text-medical-blue flex-shrink-0" />
          <span>Free returns within 30 days</span>
        </div>
      </div>
    </div>
  );
};
