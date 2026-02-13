import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../../lib/prisma';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status
        if (session.client_reference_id) {
          await prisma.order.update({
            where: { id: session.client_reference_id },
            data: {
              paymentStatus: 'PAID',
              stripePaymentId: session.payment_intent as string,
              status: 'PROCESSING',
            },
          });

          // Send order confirmation email
          // await sendOrderConfirmation(session.client_reference_id);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        if (paymentIntent.metadata.order_id) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.order_id },
            data: {
              paymentStatus: 'FAILED',
            },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Update order status
        if (charge.metadata.order_id) {
          await prisma.order.update({
            where: { id: charge.metadata.order_id },
            data: {
              paymentStatus: 'REFUNDED',
              status: 'CANCELLED',
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
