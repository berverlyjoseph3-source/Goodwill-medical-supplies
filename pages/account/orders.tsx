import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { AccountLayout } from '../../components/account/AccountLayout';
import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface OrdersPageProps {
  orders: any[];
}

export default function OrdersPage({ orders }: OrdersPageProps) {
  return (
    <ProtectedRoute>
      <AccountLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Order History</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-soft-gray rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingBagIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
              <p className="text-slate-600 mb-6">
                Start shopping to see your orders here
              </p>
              <Link href="/shop" className="btn-primary inline-block">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/order/${order.id}`}
                  className="block bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Order #{order.orderNumber}</p>
                        <p className="text-sm font-medium text-slate-900">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {order.status}
                        </span>
                        <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {order.items.slice(0, 3).map((item: any) => (
                          <div key={item.id} className="relative w-12 h-12 bg-soft-gray rounded-lg overflow-hidden">
                            <Image
                              src={item.image || '/images/placeholder.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 bg-soft-gray rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          ${Number(order.total).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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

  const orders = await prisma.order.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}
