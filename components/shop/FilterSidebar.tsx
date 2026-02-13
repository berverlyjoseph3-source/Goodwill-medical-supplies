import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FilterSidebarProps {
  filters: {
    category: string;
    priceRange: number[];
    brand: string[];
    availability: string;
    rating: number;
  };
  onFilterChange: (filters: any) => void;
}

export const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    availability: true,
    rating: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = [
    'Mobility Aids',
    'Respiratory Equipment',
    'Hospital Furniture',
    'Diagnostic Devices',
    'PPE & Disposables',
    'Home Care Supplies'
  ];

  const brands = ['Goodwill Medical', 'HealthCare Pro', 'MedTech', 'CarePlus', 'Vital Signs'];
  const ratings = [5, 4, 3, 2, 1];

  return (
    <aside className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-slate-700">Category</span>
          {openSections.category ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        {openSections.category && (
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                  className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
                />
                <span className="ml-2 text-sm text-slate-600">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-slate-700">Price Range</span>
          {openSections.price ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        {openSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => onFilterChange({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => onFilterChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-slate-700">Brand</span>
          {openSections.brand ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        {openSections.brand && (
          <div className="mt-3 space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  value={brand}
                  checked={filters.brand.includes(brand)}
                  onChange={(e) => {
                    const newBrands = e.target.checked
                      ? [...filters.brand, brand]
                      : filters.brand.filter(b => b !== brand);
                    onFilterChange({ ...filters, brand: newBrands });
                  }}
                  className="w-4 h-4 text-medical-blue rounded focus:ring-medical-blue"
                />
                <span className="ml-2 text-sm text-slate-600">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-slate-700">Availability</span>
          {openSections.availability ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        {openSections.availability && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="availability"
                value="all"
                checked={filters.availability === 'all'}
                onChange={(e) => onFilterChange({ ...filters, availability: e.target.value })}
                className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
              />
              <span className="ml-2 text-sm text-slate-600">All</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="availability"
                value="in_stock"
                checked={filters.availability === 'in_stock'}
                onChange={(e) => onFilterChange({ ...filters, availability: e.target.value })}
                className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
              />
              <span className="ml-2 text-sm text-slate-600">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="availability"
                value="out_of_stock"
                checked={filters.availability === 'out_of_stock'}
                onChange={(e) => onFilterChange({ ...filters, availability: e.target.value })}
                className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
              />
              <span className="ml-2 text-sm text-slate-600">Out of Stock</span>
            </label>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="py-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-slate-700">Customer Rating</span>
          {openSections.rating ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        {openSections.rating && (
          <div className="mt-3 space-y-2">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => onFilterChange({ ...filters, rating: Number(e.target.value) })}
                  className="w-4 h-4 text-medical-blue focus:ring-medical-blue"
                />
                <span className="ml-2 text-sm text-slate-600">
                  {rating} ★ & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({
          category: '',
          priceRange: [0, 5000],
          brand: [],
          availability: 'all',
          rating: 0
        })}
        className="w-full mt-4 px-4 py-2 text-sm text-medical-blue border border-medical-blue rounded-lg hover:bg-medical-blue/5 transition-colors"
      >
        Clear All Filters
      </button>
    </aside>
  );
};
