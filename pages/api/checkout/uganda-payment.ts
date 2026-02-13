// pages/api/checkout/uganda-payment.ts
// Complete Uganda payment processing endpoint

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';
import { 
  initializeUgandaPayment, 
  UGANDA_PAYMENT_METHODS,
  FlutterwaveConfig 
} from '../../../lib/uganda-payments';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  const session = await getServerSession(req, res, authOptions);

  try {
    const { 
      orderId, 
      paymentMethodId, 
      phoneNumber,
      network,
      currency = 'UGX' 
    } = req.body;

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Get payment method configuration
    const paymentMethod = UGANDA_PAYMENT_METHODS.find(
      m => m.id === paymentMethodId
    );

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    // ============================================
    // FLUTTERWAVE PAYMENT (MTN, Airtel, Cards)
    // ============================================
    if (paymentMethod.provider === 'flutterwave') {
      const flutterwaveConfig: FlutterwaveConfig = {
        publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY!,
        secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
        encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY!,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      };

      // Validate Uganda phone number for mobile money
      if (paymentMethod.id.includes('mtn') || paymentMethod.id.includes('airtel')) {
        if (!phoneNumber) {
          return res.status(400).json({
            success: false,
            message: 'Phone number is required for mobile money',
          });
        }

        // Format phone number for Uganda
        let formattedPhone = phoneNumber.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
          formattedPhone = `256${formattedPhone.slice(1)}`;
        } else if (!formattedPhone.startsWith('256')) {
          formattedPhone = `256${formattedPhone}`;
        }

        const payment = await initializeUgandaPayment(flutterwaveConfig, {
          amount: Number(order.total),
          currency: currency as 'UGX' | 'USD',
          email: order.user?.email || order.email || 'customer@example.com',
          phoneNumber: formattedPhone,
          fullName: order.user?.name || 'Customer',
          paymentMethod: 'mobilemoney',
          network: paymentMethod.network as 'MTN' | 'AIRTEL',
          redirectUrl: `${process.env.NEXTAUTH_URL}/checkout/success`,
          meta: {
            orderId: order.id,
            customerId: order.userId || undefined,
            products: order.items.map(item => ({
              id: item.productId || 'unknown',
              name: item.name,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          },
        });

        if (payment.status === 'success') {
          // Update order with payment reference
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentMethod: paymentMethod.id,
              stripePaymentId: payment.data?.reference, // Reuse field for Flutterwave ref
              paymentStatus: 'PENDING',
            },
          });

          return res.status(200).json({
            success: true,
            paymentUrl: payment.data?.link,
            reference: payment.data?.reference,
            message: 'Please complete payment on the next screen',
          });
        }

        return res.status(400).json({
          success: false,
          message: payment.message,
        });
      }

      // Card payment
      if (paymentMethod.id === 'card') {
        const payment = await initializeUgandaPayment(flutterwaveConfig, {
          amount: Number(order.total),
          currency: 'USD', // Cards typically processed in USD
          email: order.user?.email || order.email || 'customer@example.com',
          phoneNumber: '256700000000', // Optional for card
          fullName: order.user?.name || 'Customer',
          paymentMethod: 'card',
          redirectUrl: `${process.env.NEXTAUTH_URL}/checkout/success`,
          meta: {
            orderId: order.id,
            customerId: order.userId || undefined,
            products: order.items.map(item => ({
              id: item.productId || 'unknown',
              name: item.name,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          },
        });

        if (payment.status === 'success') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentMethod: 'card',
              stripePaymentId: payment.data?.reference,
              paymentStatus: 'PENDING',
            },
          });

          return res.status(200).json({
            success: true,
            paymentUrl: payment.data?.link,
            reference: payment.data?.reference,
          });
        }
      }
    }

    // ============================================
    // PESAPAL PAYMENT (BoU Licensed)
    // ============================================
    if (paymentMethod.provider === 'pesapal') {
      const { initializePesapalPayment } = await import('../../../lib/uganda-payments');
      
      const pesapalConfig = {
        consumerKey: process.env.PESAPAL_CONSUMER_KEY!,
        consumerSecret: process.env.PESAPAL_CONSUMER_SECRET!,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      };

      const payment = await initializePesapalPayment(pesapalConfig, {
        amount: Number(order.total),
        currency: 'UGX',
        description: `Goodwill Medical Supplies - Order ${order.orderNumber}`,
        reference: order.orderNumber,
        email: order.user?.email || order.email || 'customer@example.com',
        phoneNumber: phoneNumber,
        firstName: order.user?.name?.split(' ')[0] || 'Customer',
        lastName: order.user?.name?.split(' ').slice(1).join(' ') || '',
        callbackUrl: `${process.env.NEXTAUTH_URL}/checkout/pesapal-callback`,
      });

      if (payment.order_tracking_id) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentMethod: 'pesapal',
            stripePaymentId: payment.order_tracking_id,
            paymentStatus: 'PENDING',
          },
        });

        return res.status(200).json({
          success: true,
          paymentUrl: payment.redirect_url,
          trackingId: payment.order_tracking_id,
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: 'Payment initialization failed',
    });

  } catch (error) {
    console.error('Uganda payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process payment',
    });
  }
}
