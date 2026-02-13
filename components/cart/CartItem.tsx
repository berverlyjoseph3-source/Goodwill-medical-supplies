import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    slug: string;
    inventory?: number;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <div className={`p-4 flex items-start space-x-4 transition-opacity duration-300 ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
      {/* Product Image */}
      <Link href={`/product/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-soft-gray rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <Link 
            href={`/product/${item.slug}`}
            className="hover:text-medical-blue transition-colors"
          >
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              {item.name}
            </h3>
          </Link>
          <button
            onClick={handleRemove}
            className="text-slate-400 hover:text-red-600 transition-colors ml-4"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-2">
          ${item.price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="p-1.5 hover:bg-gray-50 transition-colors rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(
                item.id, 
                item.inventory ? Math.min(item.inventory, item.quantity + 1) : item.quantity + 1
              )}
              className="p-1.5 hover:bg-gray-50 transition-colors rounded-r-lg"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm font-medium text-slate-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {item.inventory && item.inventory < 10 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {item.inventory} left in stock
          </p>
        )}
      </div>
    </div>
  );
};
