import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  slug: z.string().optional(),
  description: z.string(),
  shortDescription: z.string(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  inventory: z.number().int().min(0),
  categoryId: z.string(),
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
  const session = await getServerSession(req, res, authOptions);

  // GET - Public, no auth required
  if (req.method === 'GET') {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        search,
        minPrice,
        maxPrice,
        brand,
        sort = 'createdAt',
        order = 'desc',
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};

      if (category) {
        where.categoryId = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { sku: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      if (brand) {
        where.brand = { in: (brand as string).split(',') };
      }

      // Get products with pagination
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
          orderBy: { [sort as string]: order },
          skip,
          take,
        }),
        prisma.product.count({ where }),
      ]);

      // Format products
      const formattedProducts = products.map(product => ({
        ...product,
        image: product.images[0]?.url || null,
        images: undefined,
      }));

      return res.status(200).json({
        success: true,
        products: formattedProducts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('GET products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
      });
    }
  }

  // POST - Admin only
  if (req.method === 'POST') {
    // Check authentication
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    try {
      // Validate request body
      const body = productSchema.parse(req.body);

      // Generate slug if not provided
      const slug = body.slug || body.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if SKU already exists
      const existingSku = await prisma.product.findUnique({
        where: { sku: body.sku },
      });

      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists',
        });
      }

      // Create product
      const product = await prisma.product.create({
        data: {
          name: body.name,
          sku: body.sku,
          slug,
          description: body.description,
          shortDescription: body.shortDescription,
          price: body.price,
          salePrice: body.salePrice || null,
          inventory: body.inventory,
          categoryId: body.categoryId,
          brand: body.brand,
          tags: body.tags || [],
          features: body.features || [],
          isFeatured: body.isFeatured || false,
          isNew: body.isNew || false,
          deliveryEstimate: body.deliveryEstimate,
          warranty: body.warranty,
          images: {
            create: body.images?.map((url, index) => ({
              url,
              alt: body.name,
              order: index,
            })) || [],
          },
        },
        include: {
          category: true,
          images: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
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

      console.error('POST product error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
