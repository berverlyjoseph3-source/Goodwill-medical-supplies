import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

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

  try {
    const { q, limit = 10 } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    // Search products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { category: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      take: Number(limit),
    });

    // Search categories
    const categories = await prisma.category.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: 5,
    });

    const formattedProducts = products.map(product => ({
      ...product,
      image: product.images[0]?.url || null,
      images: undefined,
    }));

    return res.status(200).json({
      success: true,
      products: formattedProducts,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: cat._count.products,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to perform search',
    });
  }
}
