import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '../../constants/images';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface RelatedProductsProps {
  category: string;
  currentProductId: number;
}

export const RelatedProducts = ({ category, currentProductId }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Filter products by same category, exclude current product
    const filtered = PRODUCTS
      .filter(p => p.categorySlug === category && p.id !== currentProductId)
      .slice(0, 4);
    setRelatedProducts(filtered);
  }, [category, currentProductId]);

  if (relatedProducts.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-6">You May Also Need</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product) => (
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
              {product.salePrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Sale
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-slate-800 group-hover:text-medical-blue line-clamp-2 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">
                  ${product.salePrice || product.price}
                </span>
                <span className="text-xs text-slate-500">
                  {product.reviewCount} reviews
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
