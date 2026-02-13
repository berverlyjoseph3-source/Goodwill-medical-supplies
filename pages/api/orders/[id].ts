import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID',
    });
  }

  // GET - Users can see their own orders, admins can see all
  if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
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
          billingAddress: true,
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Check authorization
      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      if (session.user.role !== 'ADMIN' && 
          session.user.role !== 'MANAGER' && 
          order.userId !== session.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error('GET order error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
      });
    }
  }

  // PUT/PATCH - Admin only
  if (req.method === 'PUT' || req.method === 'PATCH') {
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    try {
      const body = orderUpdateSchema.parse(req.body);

      const order = await prisma.order.update({
        where: { id },
        data: body,
        include: {
          user: true,
          items: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      console.error('UPDATE order error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update order',
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
