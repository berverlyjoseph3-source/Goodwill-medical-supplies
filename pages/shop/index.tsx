import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterSidebar } from '../../components/shop/FilterSidebar';
import { ProductGrid } from '../../components/shop/ProductGrid';
import { ProductSkeleton } from '../../components/ui/ProductSkeleton';
import { SortSelect } from '../../components/shop/SortSelect';
import { MobileFilterDrawer } from '../../components/shop/MobileFilterDrawer';
import { Pagination } from '../../components/shop/Pagination';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { PRODUCTS } from '../../constants/images'; // IMPORT REAL PRODUCTS!

export default function ShopPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: router.query.category || '',
    priceRange: [0, 5000],
    brand: [] as string[],
    availability: 'all',
    rating: 0
  });
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // USE THE REAL PRODUCTS FROM CONSTANTS!
  const [products, setProducts] = useState(PRODUCTS);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(PRODUCTS); // USE REAL PRODUCTS
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, sortBy, currentPage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-soft-gray py-3" aria-label="Breadcrumb">
        <div className="container-padding max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-medical-blue">Home</Link></li>
            <li><ChevronRightIcon className="w-4 h-4 text-slate-400" /></li>
            <li className="text-slate-800 font-medium">Shop</li>
          </ol>
        </div>
      </nav>

      <div className="container-padding max-w-7xl mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden btn-secondary w-full mb-4 flex items-center justify-center"
            aria-label="Open filters"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
            Filters
          </button>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <MobileFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFilterChange={setFilters}
              />
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-slate-600 mb-2 sm:mb-0">
                Showing <span className="font-semibold">1</span> - 
                <span className="font-semibold"> {products.length}</span> of 
                <span className="font-semibold"> {products.length}</span> products
              </p>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>

            {/* Product Grid - NOW WITH REAL IMAGES! */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
