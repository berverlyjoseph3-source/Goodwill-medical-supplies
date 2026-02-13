import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    lowStockCount: number;
    pendingOrders: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: '+12.5%',
      changeType: 'increase',
      color: 'bg-green-500',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      change: '+8.2%',
      changeType: 'increase',
      color: 'bg-medical-blue',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: CubeIcon,
      change: '+4.3%',
      changeType: 'increase',
      color: 'bg-purple-500',
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      change: '+18.7%',
      changeType: 'increase',
      color: 'bg-amber-500',
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders.toLocaleString(),
      icon: ClockIcon,
      change: '-2.1%',
      changeType: 'decrease',
      color: 'bg-orange-500',
    },
    {
      name: 'Low Stock',
      value: stats.lowStockCount.toLocaleString(),
      icon: ExclamationTriangleIcon,
      change: '+5.3%',
      changeType: 'increase',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              card.changeType === 'increase' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {card.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {card.value}
          </h3>
          <p className="text-sm text-slate-600">
            {card.name}
          </p>
        </div>
      ))}
    </div>
  );
};
