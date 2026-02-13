import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { AccountLayout } from '../../components/account/AccountLayout';
import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon, 
  MapPinIcon,
  CreditCardIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

interface DashboardProps {
  user: any;
  stats: {
    totalOrders: number;
    totalSpent: number;
    wishlistCount: number;
  };
}

export default function AccountDashboard({ user, stats }: DashboardProps) {
  return (
    <ProtectedRoute>
      <AccountLayout>
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-medical-blue to-medical-blue-dark rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-blue-100">
              Manage your orders, wishlist, and account settings
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-medical-blue/10 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="w-6 h-6 text-medical-blue" />
                </div>
                <Link href="/account/orders" className="text-medical-blue hover:text-medical-blue-dark">
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
              <p className="text-sm text-slate-600">Total Orders</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">${stats.totalSpent.toFixed(2)}</p>
              <p className="text-sm text-slate-600">Total Spent</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-red-500" />
                </div>
                <Link href="/account/wishlist" className="text-medical-blue hover:text-medical-blue-dark">
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.wishlistCount}</p>
              <p className="text-sm text-slate-600">Wishlist Items</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
              <Link href="/account/orders" className="text-sm text-medical-blue hover:text-medical-blue-dark">
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {/* This will be populated from database */}
              <div className="px-6 py-4 text-center text-slate-500">
                No orders yet. Start shopping to see your orders here.
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/account/profile"
              className="flex flex-col items-center p-4 bg-soft-gray rounded-xl hover:shadow-md transition-shadow"
            >
              <UserIcon className="w-6 h-6 text-medical-blue mb-2" />
              <span className="text-sm font-medium text-slate-700">Profile</span>
            </Link>
            <Link
              href="/account/addresses"
              className="flex flex-col items-center p-4 bg-soft-gray rounded-xl hover:shadow-md transition-shadow"
            >
              <MapPinIcon className="w-6 h-6 text-medical-blue mb-2" />
              <span className="text-sm font-medium text-slate-700">Addresses</span>
            </Link>
            <Link
              href="/account/wishlist"
              className="flex flex-col items-center p-4 bg-soft-gray rounded-xl hover:shadow-md transition-shadow"
            >
              <HeartIcon className="w-6 h-6 text-medical-blue mb-2" />
              <span className="text-sm font-medium text-slate-700">Wishlist</span>
            </Link>
            <Link
              href="/account/orders"
              className="flex flex-col items-center p-4 bg-soft-gray rounded-xl hover:shadow-md transition-shadow"
            >
              <ShoppingBagIcon className="w-6 h-6 text-medical-blue mb-2" />
              <span className="text-sm font-medium text-slate-700">Orders</span>
            </Link>
          </div>
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  // Get stats
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
  });

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
  });

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + Number(order.total), 0),
    wishlistCount: wishlist.length,
  };

  return {
    props: {
      user,
      stats,
    },
  };
}
