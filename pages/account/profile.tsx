import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { AccountLayout } from '../../components/account/AccountLayout';
import { prisma } from '../../lib/prisma';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProfilePageProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    phone: user.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AccountLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-medical-blue border border-medical-blue rounded-lg hover:bg-medical-blue/5 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2.5
                             border border-gray-300 placeholder-gray-500 text-slate-900 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue 
                             focus:border-transparent disabled:bg-soft-gray disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2.5
                             border border-gray-300 placeholder-gray-500 text-slate-900 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue 
                             focus:border-transparent disabled:bg-soft-gray disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2.5
                             border border-gray-300 placeholder-gray-500 text-slate-900 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue 
                             focus:border-transparent disabled:bg-soft-gray disabled:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 btn-primary"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || '',
                      email: user.email,
                      phone: user.phone || '',
                    });
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-slate-700 
                           hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Password</h3>
            <Link
              href="/auth/reset-password"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
            >
              Change Password
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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  return {
    props: {
      user,
    },
  };
}
