// components/checkout/UgandaPaymentForm.tsx
// Complete Uganda payment form with MTN MoMo, Airtel, Card, Pesapal

import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { UGANDA_PAYMENT_METHODS, formatUgx, formatUgandaPhone } from '../../lib/uganda-payments';
import toast from 'react-hot-toast';

interface UgandaPaymentFormProps {
  orderId: string;
  amount: number;
  currency: 'UGX' | 'USD';
  email: string;
  customerName?: string;
}

export const UgandaPaymentForm = ({
  orderId,
  amount,
  currency,
  email,
  customerName,
}: UgandaPaymentFormProps) => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>('mtn-momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileNetwork, setMobileNetwork] = useState<'MTN' | 'AIRTEL'>('MTN');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const selectedPaymentMethod = UGANDA_PAYMENT_METHODS.find(
    m => m.id === selectedMethod
  );

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = UGANDA_PAYMENT_METHODS.find(m => m.id === methodId);
    
    // Show phone input for mobile money
    setShowPhoneInput(
      method?.id === 'mtn-momo' || 
      method?.id === 'airtel-money' || 
      method?.id === 'pesapal'
    );
    
    // Set default network
    if (method?.id === 'mtn-momo') setMobileNetwork('MTN');
    if (method?.id === 'airtel-money') setMobileNetwork('AIRTEL');
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Uganda format: 256XXXXXXXXX or 0XXXXXXXXX
    if (cleaned.startsWith('256') && cleaned.length === 12) return true;
    if (cleaned.startsWith('0') && cleaned.length === 10) return true;
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number for mobile money
    if (showPhoneInput && !validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid Uganda phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout/uganda-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethodId: selectedMethod,
          phoneNumber: showPhoneInput ? phoneNumber : undefined,
          network: mobileNetwork,
          currency,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirect to payment page
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.message || 'Payment failed');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-blue to-medical-blue-dark px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          Pay in Uganda Shillings (UGX)
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          🇺🇬 MTN MoMo • Airtel Money • Card • Bank Transfer
        </p>
      </div>

      <div className="p-6">
        {/* Amount Display */}
        <div className="mb-6 p-4 bg-soft-gray rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-slate-900">
            {currency === 'UGX' ? formatUgx(amount) : `$${amount.toFixed(2)}`}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Methods Grid */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {UGANDA_PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleMethodChange(method.id)}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    selectedMethod === method.id
                      ? 'border-medical-blue bg-medical-blue/5 ring-2 ring-medical-blue/20'
                      : 'border-gray-200 hover:border-medical-blue/50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{method.icon}</span>
                  <p className="font-medium text-sm text-slate-900">
                    {method.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {method.description}
                  </p>
                  {method.id === 'pesapal' && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      BoU Licensed
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Money Network Selection */}
          {(selectedMethod === 'mtn-momo' || selectedMethod === 'airtel-money') && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-3">
                📱 Mobile Money Network
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={mobileNetwork === 'MTN'}
                    onChange={() => setMobileNetwork('MTN')}
                    className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
                  />
                  <span className="ml-2 text-sm text-slate-700">MTN Uganda</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={mobileNetwork === 'AIRTEL'}
                    onChange={() => setMobileNetwork('AIRTEL')}
                    className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
                  />
                  <span className="ml-2 text-sm text-slate-700">Airtel Uganda</span>
                </label>
              </div>
            </div>
          )}

          {/* Phone Number Input (for mobile money) */}
          {showPhoneInput && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Money Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">🇺🇬 +256</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber.replace('+256', '').replace('256', '')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(value);
                  }}
                  placeholder="700 123 456"
                  className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Enter your MTN or Airtel phone number. You will receive a payment request on your phone.
              </p>
              <div className="mt-2 flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <span className="mr-1">⚠️</span>
                Test mode: No real money will be deducted in sandbox
              </div>
            </div>
          )}

          {/* Payment Notice for Pesapal */}
          {selectedMethod === 'pesapal' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-1">
                ✅ Bank of Uganda Licensed Payment Operator
              </p>
              <p className="text-xs text-green-700">
                Pesapal is fully licensed by the Bank of Uganda to process payments securely [citation:3].
                You will be redirected to Pesapal's secure payment page.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Pay {currency === 'UGX' ? formatUgx(amount) : `$${amount.toFixed(2)}`}</span>
                {selectedMethod.includes('momo') && <span className="ml-2">📱</span>}
              </div>
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-4 text-xs text-slate-500">
              <span>🔒 256-bit SSL</span>
              <span>•</span>
              <span>🏦 PCI DSS Level 1</span>
              <span>•</span>
              <span>🇺🇬 Bank of Uganda Licensed</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
