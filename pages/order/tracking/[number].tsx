import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CubeIcon,
  TruckIcon,
  HomeIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { OrderStatus } from '../../../components/order/OrderStatus';
import toast from 'react-hot-toast';

// Mock order data - In production, fetch from API
const MOCK_ORDERS = {
  'GM12345678': {
    orderNumber: 'GM12345678',
    status: 'SHIPPED',
    orderDate: '2024-01-15',
    estimatedDelivery: '2024-01-18',
    deliveredDate: null,
    carrier: 'FedEx',
    trackingNumber: '789012345678',
    shippingAddress: {
      name: 'Dr. Sarah Chen',
      address1: '123 Medical Center Blvd',
      address2: 'Suite 100',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
    items: [
      {
        id: 1,
        name: 'Premium Lightweight Wheelchair',
        quantity: 1,
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1584518938427-8fd3918eb3c0?w=200&q=80',
      },
      {
        id: 2,
        name: 'Digital Blood Pressure Monitor',
        quantity: 2,
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=200&q=80',
      },
    ],
    subtotal: 399.97,
    shipping: 0,
    tax: 32.00,
    total: 431.97,
    timeline: [
      {
        status: 'ORDERED',
        date: '2024-01-15T10:30:00',
        location: 'Online Store',
        description: 'Order placed successfully',
      },
      {
        status: 'PROCESSING',
        date: '2024-01-15T14:20:00',
        location: 'Chicago, IL',
        description: 'Order confirmed and processing',
      },
      {
        status: 'PICKED',
        date: '2024-01-16T09:15:00',
        location: 'Chicago, IL',
        description: 'Items picked from inventory',
      },
      {
        status: 'PACKED',
        date: '2024-01-16T11:30:00',
        location: 'Chicago, IL',
        description: 'Order packaged and labeled',
      },
      {
        status: 'SHIPPED',
        date: '2024-01-16T16:45:00',
        location: 'Chicago, IL',
        description: 'Shipped via FedEx - Tracking #789012345678',
      },
    ],
  },
  'GM87654321': {
    orderNumber: 'GM87654321',
    status: 'DELIVERED',
    orderDate: '2024-01-10',
    estimatedDelivery: '2024-01-13',
    deliveredDate: '2024-01-13',
    carrier: 'UPS',
    trackingNumber: '987654321098',
    shippingAddress: {
      name: 'Maria Rodriguez',
      address1: '456 Oak Avenue',
      address2: '',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
    },
    items: [
      {
        id: 3,
        name: 'Portable Oxygen Concentrator',
        quantity: 1,
        price: 799.99,
        image: 'https://images.unsplash.com/photo-1584547366618-c4673b5e9b16?w=200&q=80',
      },
    ],
    subtotal: 799.99,
    shipping: 0,
    tax: 64.00,
    total: 863.99,
    timeline: [
      {
        status: 'ORDERED',
        date: '2024-01-10T08:15:00',
        location: 'Online Store',
        description: 'Order placed successfully',
      },
      {
        status: 'PROCESSING',
        date: '2024-01-10T11:30:00',
        location: 'Miami, FL',
        description: 'Order confirmed and processing',
      },
      {
        status: 'SHIPPED',
        date: '2024-01-11T09:45:00',
        location: 'Miami, FL',
        description: 'Shipped via UPS - Tracking #987654321098',
      },
      {
        status: 'OUT_FOR_DELIVERY',
        date: '2024-01-13T08:30:00',
        location: 'Miami, FL',
        description: 'Out for delivery',
      },
      {
        status: 'DELIVERED',
        date: '2024-01-13T14:20:00',
        location: 'Miami, FL',
        description: 'Delivered - Signed by M. Rodriguez',
      },
    ],
  },
};

export default function OrderTrackingPage() {
  const router = useRouter();
  const { number } = router.query;
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (number) {
      setOrderNumber(number as string);
      fetchOrder(number as string);
    }
  }, [number]);

  const fetchOrder = async (orderNum: string) => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = MOCK_ORDERS[orderNum as keyof typeof MOCK_ORDERS];
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check the order number and try again.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/order/tracking/${orderNumber.trim()}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-700';
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return CheckCircleIcon;
      case 'SHIPPED': return TruckIcon;
      case 'PROCESSING': return CubeIcon;
      case 'ORDERED': return ClockIcon;
      case 'OUT_FOR_DELIVERY': return TruckIcon;
      default: return ClockIcon;
    }
  };

  if (!number) {
    return (
      <>
        <Header />
        <main className="bg-white py-16">
          <div className="container-padding max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Track Your Order
              </h1>
              <p className="text-lg text-slate-600">
                Enter your order number to check status and tracking information
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Order Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g., GM12345678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Found in your order confirmation email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!orderNumber.trim()}
                  className="w-full btn-primary py-3"
                >
                  Track Order
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-slate-600 text-center">
                  Need help?{' '}
                  <Link href="/contact" className="text-medical-blue hover:text-medical-blue-dark font-medium">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white py-12">
        <div className="container-padding max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/order/tracking" className="text-medical-blue hover:text-medical-blue-dark text-sm font-medium mb-4 inline-block">
              ← Track Another Order
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Order #{orderNumber}
            </h1>
            <p className="text-lg text-slate-600">
              Track your order status and delivery information
            </p>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading order information...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CubeIcon className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <Link href="/order/tracking" className="btn-primary inline-block">
                Try Again
              </Link>
            </div>
          ) : order ? (
            <div className="space-y-8">
              {/* Status Banner */}
              <div className={`rounded-2xl p-6 ${getStatusColor(order.status)} bg-opacity-10`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Current Status</p>
                    <h2 className="text-2xl font-bold">{order.status}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium mb-1">Estimated Delivery</p>
                    <p className="text-lg font-bold">
                      {order.estimatedDelivery 
                        ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Order Timeline</h3>
                <div className="space-y-4">
                  {order.timeline.map((event: any, index: number) => {
                    const Icon = getStatusIcon(event.status);
                    const isLast = index === order.timeline.length - 1;
                    
                    return (
                      <div key={index} className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center
                            ${event.status === order.status 
                              ? 'bg-medical-blue text-white' 
                              : 'bg-soft-gray text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {!isLast && (
                            <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-semibold text-slate-900">
                              {event.status.replace(/_/g, ' ')}
                            </h4>
                            <span className="text-sm text-slate-500">
                              {new Date(event.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{event.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-medical-blue/10 rounded-lg flex items-center justify-center">
                      <TruckIcon className="w-5 h-5 text-medical-blue" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Shipping Information</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500">Carrier</p>
                      <p className="font-medium text-slate-900">{order.carrier}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Tracking Number</p>
                      <p className="font-mono text-sm text-slate-900">{order.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Shipping Address</p>
                      <p className="font-medium text-slate-900">{order.shippingAddress.name}</p>
                      <p className="text-slate-600">{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && (
                        <p className="text-slate-600">{order.shippingAddress.address2}</p>
                      )}
                      <p className="text-slate-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-medical-blue/10 rounded-lg flex items-center justify-center">
                      <CubeIcon className="w-5 h-5 text-medical-blue" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Order Summary</h3>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-soft-gray rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium text-slate-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-medium text-slate-900">
                          {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-medium text-slate-900">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2">
                        <span className="text-slate-900">Total</span>
                        <span className="text-medical-blue">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-soft-gray rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Need help with your order?</h3>
                    <p className="text-sm text-slate-600">
                      Our support team is available 24/7 to assist you
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      href="/contact"
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-slate-700 
                               hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2 inline-block" />
                      Email
                    </Link>
                    <Link
                      href="tel:+18001234567"
                      className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue-dark 
                               transition-colors text-sm font-medium"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2 inline-block" />
                      Call Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
