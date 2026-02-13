import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().optional().nullable(),
  inventory: z.number().int().min(0).optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  deliveryEstimate: z.string().optional(),
  warranty: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID',
    });
  }

  // GET - Public
  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
          specifications: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error('GET product error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
      });
    }
  }

  // PUT/PATCH - Admin only
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const session = await getServerSession(req, res, authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    try {
      // Validate request body
      const body = productUpdateSchema.parse(req.body);

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // Check if SKU is being updated and already exists
      if (body.sku && body.sku !== existingProduct.sku) {
        const skuExists = await prisma.product.findUnique({
          where: { sku: body.sku },
        });

        if (skuExists) {
          return res.status(400).json({
            success: false,
            message: 'Product with this SKU already exists',
          });
        }
      }

      // Generate slug if name is updated
      let slug = body.slug;
      if (body.name && !slug) {
        slug = body.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      // Update product
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...body,
          slug,
          // Handle images separately
          images: body.images ? {
            deleteMany: {},
            create: body.images.map((url, index) => ({
              url,
              alt: body.name || existingProduct.name,
              order: index,
            })),
          } : undefined,
        },
        include: {
          category: true,
          images: {
            orderBy: { order: 'asc' },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      console.error('PUT product error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update product',
      });
    }
  }

  // DELETE - Admin only
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    try {
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // Delete product (cascades to images, specs, reviews)
      await prisma.product.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('DELETE product error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product',
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
