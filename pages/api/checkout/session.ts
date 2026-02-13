import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

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

  try {
    const session = await getServerSession(req, res, authOptions);
    const { items, successUrl, cancelUrl, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid items',
      });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || `Medical equipment - SKU: ${item.sku}`,
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.id,
            sku: item.sku,
          },
        },
        unit_amount: Math.round((item.salePrice || item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/checkout/cancelled`,
      customer_email: session?.user?.email || undefined,
      client_reference_id: orderId,
      metadata: {
        order_id: orderId,
        user_id: session?.user?.id || 'guest',
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return res.status(200).json({
      success: true,
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error('Stripe session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
}
