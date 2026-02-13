import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PRODUCTS } from '../../constants/images';

export const FeaturedProducts = ({ products = PRODUCTS.slice(0, 8) }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="aspect-square relative bg-gradient-to-br from-soft-gray to-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {product.salePrice && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Sale
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-medical-blue transition-colors line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(product.rating) ? (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
                  )
                ))}
              </div>
              <span className="text-xs text-slate-500 ml-2">({product.reviewCount})</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                {product.salePrice ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-medical-blue">
                      ${product.salePrice}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ${product.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-slate-800">
                    ${product.price}
                  </span>
                )}
              </div>
              
              <span className="text-sm text-slate-500">
                {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
