import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { prisma } from '../../../lib/prisma';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  ShieldCheckIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface UsersPageProps {
  users: any[];
}

export default function UsersPage({ users: initialUsers }: UsersPageProps) {
  const [users, setUsers] = useState(initialUsers);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        toast.success('User role updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'MANAGER': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Users
            </h1>
            <p className="text-slate-600 mt-1">
              Manage customer accounts and staff permissions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-soft-gray rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-medical-blue font-semibold text-lg">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {user.name || 'No name'}
                        </h3>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    {user.role !== 'ADMIN' && (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 
                                 focus:outline-none focus:ring-2 focus:ring-medical-blue"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-slate-600">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-slate-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Orders:</span>
                      <span className="font-medium text-slate-900">
                        {user._count?.orders || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}
