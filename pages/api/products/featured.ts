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
    const { limit = 8 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
    });

    const formattedProducts = products.map(product => ({
      ...product,
      image: product.images[0]?.url || null,
      images: undefined,
    }));

    return res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error('GET featured products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
    });
  }
}
