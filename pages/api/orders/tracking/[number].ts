import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  const { number } = req.query;

  if (!number || typeof number !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid order number',
    });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: number },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Generate mock timeline based on order status
    const timeline = [];
    
    timeline.push({
      status: 'ORDERED',
      date: order.createdAt,
      location: 'Online Store',
      description: 'Order placed successfully',
    });

    if (order.status !== 'PENDING') {
      timeline.push({
        status: 'PROCESSING',
        date: new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000),
        location: order.shippingAddress?.city || 'Processing Center',
        description: 'Order confirmed and processing',
      });
    }

    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      timeline.push({
        status: 'SHIPPED',
        date: new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000),
        location: order.shippingAddress?.city || 'Distribution Center',
        description: `Shipped via ${order.carrier || 'Standard Shipping'} - Tracking #${order.trackingNumber || 'N/A'}`,
      });
    }

    if (order.status === 'DELIVERED') {
      timeline.push({
        status: 'DELIVERED',
        date: new Date(order.createdAt.getTime() + 72 * 60 * 60 * 1000),
        location: order.shippingAddress?.city || 'Destination',
        description: 'Delivered - Signed by recipient',
      });
    }

    if (order.status === 'CANCELLED') {
      timeline.push({
        status: 'CANCELLED',
        date: new Date(order.updatedAt),
        location: 'Customer Service',
        description: 'Order cancelled',
      });
    }

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        timeline: timeline.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      },
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track order',
    });
  }
}
