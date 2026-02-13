import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
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

  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    // Get date ranges
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get all stats in parallel
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      yearRevenue,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      recentOrders,
      topProducts,
      categoryStats,
    ] = await Promise.all([
      // Order counts
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      
      // Revenue
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { paymentStatus: 'PAID' } 
      }),
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          createdAt: { gte: startOfDay },
          paymentStatus: 'PAID' 
        } 
      }),
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          createdAt: { gte: startOfWeek },
          paymentStatus: 'PAID' 
        } 
      }),
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          createdAt: { gte: startOfMonth },
          paymentStatus: 'PAID' 
        } 
      }),
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          createdAt: { gte: startOfYear },
          paymentStatus: 'PAID' 
        } 
      }),
      
      // Product stats
      prisma.product.count(),
      prisma.product.count({ where: { inventory: { lt: 10, gt: 0 } } }),
      prisma.product.count({ where: { inventory: 0 } }),
      
      // User stats
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: { take: 1 },
        },
      }),
      
      // Top products
      prisma.product.findMany({
        take: 5,
        orderBy: { reviewCount: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          price: true,
          salePrice: true,
          reviewCount: true,
          rating: true,
          inventory: true,
        },
      }),
      
      // Category stats
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    // Generate sales chart data (last 7 days)
    const salesData = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const result = await prisma.order.aggregate({
          _sum: { total: true },
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
            paymentStatus: 'PAID',
          },
        });

        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          sales: result._sum.total || 0,
        };
      })
    );

    return res.status(200).json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        revenue: {
          total: totalRevenue._sum.total || 0,
          today: todayRevenue._sum.total || 0,
          week: weekRevenue._sum.total || 0,
          month: monthRevenue._sum.total || 0,
          year: yearRevenue._sum.total || 0,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newWeek: newUsersWeek,
          newMonth: newUsersMonth,
        },
      },
      recentOrders,
      topProducts,
      categoryStats,
      salesData,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
}
