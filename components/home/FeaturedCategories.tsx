import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '../../constants/images';

export const FeaturedCategories = ({ categories = CATEGORIES }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="aspect-square relative">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-white/90">{category.productCount} products</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
