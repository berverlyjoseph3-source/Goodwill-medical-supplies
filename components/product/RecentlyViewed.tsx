import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '../../constants/images';

interface RecentlyViewedProps {
  currentProductId: number;
}

export const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Get recently viewed from localStorage
    const viewed = localStorage.getItem('recentlyViewed');
    let recentlyViewed = viewed ? JSON.parse(viewed) : [];
    
    // Add current product
    if (!recentlyViewed.includes(currentProductId)) {
      recentlyViewed.unshift(currentProductId);
      recentlyViewed = recentlyViewed.slice(0, 6); // Keep only 6
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
    
    // Get product details
    const products = recentlyViewed
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(p => p && p.id !== currentProductId)
      .slice(0, 4);
    
    setRecentProducts(products);
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {recentProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-square relative bg-soft-gray">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-slate-800 group-hover:text-medical-blue line-clamp-2">
                {product.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
