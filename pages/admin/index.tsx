import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCards } from '../../components/admin/StatsCards';
import { RecentOrders } from '../../components/admin/RecentOrders';
import { InventoryAlert } from '../../components/admin/InventoryAlert';
import { SalesChart } from '../../components/admin/SalesChart';
import { prisma } from '../../lib/prisma';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

interface AdminDashboardProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    lowStockCount: number;
    pendingOrders: number;
  };
  recentOrders: any[];
  lowStockProducts: any[];
  salesData: any[];
}

export default function AdminDashboard({ 
  stats, 
  recentOrders, 
  lowStockProducts, 
  salesData 
}: AdminDashboardProps) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts & Alerts */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SalesChart data={salesData} />
            </div>
            <div className="lg:col-span-1">
              <InventoryAlert products={lowStockProducts} />
            </div>
          </div>

          {/* Recent Orders */}
          <RecentOrders orders={recentOrders} />

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton
                href="/admin/products/new"
                icon="➕"
                label="Add Product"
                color="bg-medical-blue"
              />
              <QuickActionButton
                href="/admin/orders"
                icon="📦"
                label="Process Orders"
                color="bg-green-600"
              />
              <QuickActionButton
                href="/admin/users"
                icon="👥"
                label="Manage Users"
                color="bg-purple-600"
              />
              <QuickActionButton
                href="/admin/settings"
                icon="⚙️"
                label="Store Settings"
                color="bg-slate-600"
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const QuickActionButton = ({ href, icon, label, color }: any) => (
  <Link
    href={href}
    className="flex flex-col items-center p-4 bg-soft-gray rounded-xl hover:shadow-md transition-shadow group"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-2xl mb-2 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </Link>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Get dashboard stats
  const [
    totalOrders,
    totalProducts,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.findMany({
      where: { inventory: { lt: 10 } },
      take: 5,
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    }),
  ]);

  // Calculate total revenue
  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    select: { total: true },
  });
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

  // Generate mock sales data (replace with real data from your database)
  const salesData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sales: Math.floor(Math.random() * 5000) + 1000,
  }));

  return {
    props: {
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        lowStockCount: lowStockProducts.length,
        pendingOrders,
      },
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
      salesData,
    },
  };
}
