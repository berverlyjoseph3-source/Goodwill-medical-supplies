import { CheckCircleIcon, CubeIcon, TruckIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface OrderStatusProps {
  status: string;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-orange-100 text-orange-700',
    icon: ClockIcon,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-700',
    icon: CubeIcon,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-blue-100 text-blue-700',
    icon: TruckIcon,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircleIcon,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    icon: CheckCircleIcon,
  },
};

export const OrderStatus = ({ status, className = '' }: OrderStatusProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

interface OrderTimelineProps {
  timeline: Array<{
    status: string;
    date: string;
    location: string;
    description: string;
  }>;
  currentStatus: string;
}

export const OrderTimeline = ({ timeline, currentStatus }: OrderTimelineProps) => {
  const getStatusIcon = (status: string, isCompleted: boolean) => {
    switch (status) {
      case 'ORDERED':
      case 'PENDING':
        return ClockIcon;
      case 'PROCESSING':
      case 'PICKED':
      case 'PACKED':
        return CubeIcon;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return TruckIcon;
      case 'DELIVERED':
        return HomeIcon;
      default:
        return CheckCircleIcon;
    }
  };

  const isCompleted = (eventStatus: string) => {
    const statusOrder = ['ORDERED', 'PENDING', 'PROCESSING', 'PICKED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const eventIndex = statusOrder.indexOf(eventStatus);
    return eventIndex <= currentIndex;
  };

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => {
        const Icon = getStatusIcon(event.status, isCompleted(event.status));
        const completed = isCompleted(event.status);
        const isLast = index === timeline.length - 1;

        return (
          <div key={index} className="relative flex items-start space-x-3">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${completed 
                  ? 'bg-medical-blue text-white' 
                  : 'bg-gray-100 text-gray-400'}`}>
                {completed ? (
                  <CheckCircleSolid className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {!isLast && (
                <div className={`absolute top-8 left-4 w-0.5 h-12 
                  ${completed ? 'bg-medical-blue' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className={`font-semibold ${completed ? 'text-slate-900' : 'text-slate-500'}`}>
                  {event.status.replace(/_/g, ' ')}
                </h4>
                <span className="text-sm text-slate-500">
                  {new Date(event.date).toLocaleString()}
                </span>
              </div>
              <p className={`text-sm mt-1 ${completed ? 'text-slate-600' : 'text-slate-400'}`}>
                {event.description}
              </p>
              <p className={`text-xs mt-1 ${completed ? 'text-slate-500' : 'text-slate-400'}`}>
                {event.location}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
