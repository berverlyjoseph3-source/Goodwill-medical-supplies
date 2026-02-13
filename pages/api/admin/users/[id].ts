import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';

const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'MANAGER', 'ADMIN']).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }

  // Prevent admin from deleting themselves
  if (id === session.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot modify your own account',
    });
  }

  // GET - Get single user
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              addresses: true,
            },
          },
          orders: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('GET user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
      });
    }
  }

  // PUT/PATCH - Update user
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = userUpdateSchema.parse(req.body);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if email is being updated and already exists
      if (body.email && body.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: body.email },
        });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use',
          });
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: body,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      console.error('UPDATE user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
      });
    }
  }

  // DELETE - Delete user
  if (req.method === 'DELETE') {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Delete user (cascades to orders, addresses, reviews, etc.)
      await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('DELETE user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
