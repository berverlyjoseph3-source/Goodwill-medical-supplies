// lib/uganda-payments.ts
// Complete Uganda payment processing service for Flutterwave + Pesapal

/**
 * IMPORTANT REALITY CHECK:
 * 
 * ❌ STRIPE IS NOT AVAILABLE IN UGANDA [citation:1][citation:4][citation:8]
 * 
 * ✅ FLUTTERWAVE IS FULLY SUPPORTED:
 *    - MTN Mobile Money (UGX)
 *    - Airtel Mobile Money (UGX)
 *    - Card payments (Visa/Mastercard)
 *    - Bank transfers
 *    Source: Flutterwave official docs [citation:6]
 * 
 * ✅ PESAPAL IS BANK OF UGANDA LICENSED:
 *    - Fully licensed payment operator
 *    - Mobile money, cards, POS
 *    Source: Bank of Uganda license [citation:3]
 */

// ============================================
// FLUTTERWAVE CONFIGURATION
// ============================================

export interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  encryptionKey: string;
  environment: 'sandbox' | 'production';
}

export interface UgandaPaymentRequest {
  amount: number;
  currency: 'UGX' | 'USD';
  email: string;
  phoneNumber: string; // Format: 256XXXXXXXXX
  fullName: string;
  paymentMethod: 'card' | 'mobilemoney' | 'banktransfer';
  network?: 'MTN' | 'AIRTEL'; // Required for mobile money
  redirectUrl: string;
  meta: {
    orderId: string;
    customerId?: string;
    products: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface FlutterwaveResponse {
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: {
    link: string;      // Redirect URL for card payments
    reference: string; // Transaction reference
    transaction_id?: string;
  };
}

/**
 * Initialize Flutterwave payment (UGANDA OPTIMIZED)
 * 
 * ✅ Supports:
 *    - MTN Mobile Money (UGX)
 *    - Airtel Mobile Money (UGX)
 *    - Card payments (USD/UGX)
 *    - Bank transfers
 */
export async function initializeUgandaPayment(
  config: FlutterwaveConfig,
  paymentData: UgandaPaymentRequest
): Promise<FlutterwaveResponse> {
  
  // Validate Uganda phone number
  if (!paymentData.phoneNumber.startsWith('256')) {
    throw new Error('Uganda phone numbers must start with country code 256');
  }

  // Validate mobile money network for UGX payments
  if (paymentData.currency === 'UGX' && 
      paymentData.paymentMethod === 'mobilemoney' && 
      !paymentData.network) {
    throw new Error('Mobile money payments require network: MTN or AIRTEL');
  }

  const payload: any = {
    tx_ref: `goodwill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: paymentData.amount,
    currency: paymentData.currency,
    redirect_url: paymentData.redirectUrl,
    customer: {
      email: paymentData.email,
      phonenumber: paymentData.phoneNumber,
      name: paymentData.fullName,
    },
    customizations: {
      title: 'Goodwill Medical Supplies',
      description: 'Medical equipment payment',
      logo: 'https://your-domain.com/logo.png',
    },
    meta: paymentData.meta,
  };

  // Add payment method specific fields
  if (paymentData.paymentMethod === 'mobilemoney') {
    payload.payment_type = 'mobilemoneyuganda';
    payload.mobilemoneyuganda = {
      phone_number: paymentData.phoneNumber,
      network: paymentData.network,
    };
  } else if (paymentData.paymentMethod === 'card') {
    payload.payment_options = 'card';
  } else if (paymentData.paymentMethod === 'banktransfer') {
    payload.payment_type = 'banktransfer';
  }

  try {
    const response = await fetch(
      config.environment === 'production'
        ? 'https://api.flutterwave.com/v3/payments'
        : 'https://api.flutterwave.com/v3/payments',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (data.status === 'success') {
      return {
        status: 'success',
        message: 'Payment initialized successfully',
        data: {
          link: data.data.link,
          reference: data.data.tx_ref,
          transaction_id: data.data.id,
        },
      };
    }

    return {
      status: 'error',
      message: data.message || 'Payment initialization failed',
    };
  } catch (error) {
    console.error('Flutterwave payment error:', error);
    return {
      status: 'error',
      message: 'Failed to initialize payment',
    };
  }
}

/**
 * Verify Flutterwave transaction
 */
export async function verifyFlutterwavePayment(
  config: FlutterwaveConfig,
  transactionId: string
): Promise<any> {
  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${config.secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}

// ============================================
// PESAPAL CONFIGURATION (BoU Licensed)
// ============================================

export interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
}

export interface PesapalPaymentRequest {
  amount: number;
  currency: 'UGX' | 'USD';
  description: string;
  reference: string; // Your order ID
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  callbackUrl: string;
}

/**
 * Initialize Pesapal payment
 * 
 * ✅ Bank of Uganda Licensed Payment Operator [citation:3]
 * ✅ Supports MTN MoMo, Airtel, Cards
 */
export async function initializePesapalPayment(
  config: PesapalConfig,
  paymentData: PesapalPaymentRequest
): Promise<any> {
  
  const baseUrl = config.environment === 'production'
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3'; // Correct sandbox URL [citation:9]

  const payload = {
    id: paymentData.reference,
    currency: paymentData.currency,
    amount: paymentData.amount,
    description: paymentData.description,
    callback_url: paymentData.callbackUrl,
    notification_id: '', // Webhook URL
    billing_address: {
      email_address: paymentData.email,
      phone_number: paymentData.phoneNumber,
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
    },
  };

  try {
    // Step 1: Get authentication token
    const authResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
      }),
    });

    const authData = await authResponse.json();
    const token = authData.token;

    // Step 2: Submit order
    const orderResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return await orderResponse.json();
  } catch (error) {
    console.error('Pesapal payment error:', error);
    throw error;
  }
}

// ============================================
// UGANDA PAYMENT METHODS CONFIGURATION
// ============================================

export const UGANDA_PAYMENT_METHODS = [
  {
    id: 'mtn-momo',
    name: 'MTN Mobile Money',
    description: 'Pay instantly with MTN MoMo',
    icon: '📱',
    provider: 'flutterwave',
    currency: 'UGX',
    network: 'MTN',
    requirements: ['Phone number must start with 256'],
    processingTime: 'Instant',
    logo: '/images/payments/mtn-momo.png',
  },
  {
    id: 'airtel-money',
    name: 'Airtel Money',
    description: 'Pay with Airtel Mobile Money',
    icon: '📱',
    provider: 'flutterwave',
    currency: 'UGX',
    network: 'AIRTEL',
    requirements: ['Phone number must start with 256'],
    processingTime: 'Instant',
    logo: '/images/payments/airtel-money.png',
  },
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard',
    icon: '💳',
    provider: 'flutterwave',
    currency: 'USD',
    processingTime: 'Instant',
    logo: '/images/payments/card.png',
  },
  {
    id: 'pesapal',
    name: 'Pesapal',
    description: 'Bank of Uganda licensed payment',
    icon: '🏦',
    provider: 'pesapal',
    currency: 'UGX',
    processingTime: 'Instant',
    logo: '/images/payments/pesapal.png',
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Direct bank deposit',
    icon: '🏦',
    provider: 'flutterwave',
    currency: 'UGX',
    processingTime: '1-2 business days',
    logo: '/images/payments/bank.png',
  },
];

// ============================================
// UGANDA CURRENCY FORMATTING
// ============================================

export function formatUgx(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUgandaPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: 256 XXX XXX XXX
  if (cleaned.startsWith('256')) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  
  // Add country code if missing
  if (cleaned.startsWith('0')) {
    return `+256 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
  }
  
  return phone;
}
