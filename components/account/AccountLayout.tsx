import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon, 
  MapPinIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/account', icon: HomeIcon },
  { name: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
  { name: 'Wishlist', href: '/account/wishlist', icon: HeartIcon },
  { name: 'Profile', href: '/account/profile', icon: UserIcon },
  { name: 'Addresses', href: '/account/addresses', icon: MapPinIcon },
  { name: 'Payment Methods', href: '/account/payment-methods', icon: CreditCardIcon },
  { name: 'Settings', href: '/account/settings', icon: Cog6ToothIcon },
];

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="bg-soft-gray min-h-screen">
      <div className="container-padding max-w-7xl mx-auto py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              My Account
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {navigation.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                          isActive
                            ? 'bg-medical-blue/10 text-medical-blue border-l-4 border-medical-blue'
                            : 'text-slate-700 hover:bg-soft-gray'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
