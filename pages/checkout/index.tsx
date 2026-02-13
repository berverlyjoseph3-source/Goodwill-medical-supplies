import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { useCartStore } from '@/stores/cartStore';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [step, setStep] = useState < 'information' | 'shipping' | 'payment' > ('information');
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <ShoppingCartIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h1>
          <p className="text-slate-600 mb-6">Add some items to your cart to checkout</p>
          <Link href="/shop" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container-padding py-8">
        {/* Checkout Steps */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <StepIndicator currentStep={step} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Elements stripe={stripePromise}>
                  <CheckoutForm step={step} onStepChange={setStep} />
                </Elements>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary 
                  items={cartItems}
                  subtotal={subtotal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}