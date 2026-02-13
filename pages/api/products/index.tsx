import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ProductFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  brand: z.string().or(z.array(z.string())).optional(),
  availability: z.enum(['in_stock', 'out_of_stock', 'all']).optional(),
  rating: z.string().transform(Number).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'rating', 'popular']).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
  search: z.string().optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const filters = ProductFilterSchema.parse(req.query);
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (filters.category) {
      where.categoryId = filters.category;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    
    if (filters.brand) {
      where.brand = {
        in: Array.isArray(filters.brand) ? filters.brand : [filters.brand]
      };
    }
    
    if (filters.availability === 'in_stock') {
      where.inventory = { gt: 0 };
    } else if (filters.availability === 'out_of_stock') {
      where.inventory = 0;
    }
    
    if (filters.rating) {
      where.rating = { gte: filters.rating };
    }
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    // Get total count
    const total = await prisma.product.count({ where });
    
    // Build order by
    let orderBy: any = {};
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    // Fetch products
    const products = await prisma.product.findMany({
      where,
      include: {
        images: { take: 1 },
        category: true
      },
      orderBy,
      skip,
      take: limit
    });
    
    return res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        from: skip + 1,
        to: Math.min(skip + limit, total)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}