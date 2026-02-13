import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useCartStore } from '../../stores/cartStore';
import { MegaMenu } from './MegaMenu';
import { SearchBar } from '../search/SearchBar';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.totalItems);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo / Website Name - EXACTLY AS YOU HAVE IT */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-medical-blue leading-tight">
                Goodwill
              </span>
              <span className="text-xs font-medium text-slate-500 -mt-1">
                Medical Supplies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - EXACTLY AS YOU HAVE IT */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/shop" className="text-slate-700 hover:text-medical-blue font-medium transition-colors">
              Shop
            </Link>
            <MegaMenu />
            <Link href="/about" className="text-slate-700 hover:text-medical-blue font-medium transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-slate-700 hover:text-medical-blue font-medium transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-medical-blue font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Actions Icons - FIXED LINKS ONLY */}
          <div className="flex items-center space-x-3">
            {/* ✅ FIXED: Wishlist now points to correct page */}
            <Link 
              href="/account/wishlist" 
              className="p-2 hover:bg-soft-gray rounded-full transition-colors relative group"
              aria-label="Wishlist"
            >
              <HeartIcon className="w-5 h-5 text-slate-600 group-hover:text-medical-blue" />
            </Link>
            
            {/* Cart - WORKING */}
            <Link 
              href="/cart" 
              className="p-2 hover:bg-soft-gray rounded-full transition-colors relative group"
              aria-label={`Cart with ${cartItemsCount} items`}
            >
              <ShoppingCartIcon className="w-5 h-5 text-slate-600 group-hover:text-medical-blue" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-medical-blue text-white 
                               text-xs w-5 h-5 rounded-full flex items-center justify-center
                               animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* ✅ FIXED: Account now points to signin for guests */}
            <Link 
              href="/auth/signin" 
              className="p-2 hover:bg-soft-gray rounded-full transition-colors group"
              aria-label="Sign In"
            >
              <UserIcon className="w-5 h-5 text-slate-600 group-hover:text-medical-blue" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-soft-gray rounded-full transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-slate-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu Dropdown - FIXED LINKS ONLY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container-padding max-w-7xl mx-auto py-4">
              <nav className="flex flex-col space-y-3">
                <Link 
                  href="/shop" 
                  className="py-2 px-4 text-slate-700 hover:bg-soft-gray hover:text-medical-blue rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                {/* ✅ FIXED: Categories now points to shop (since /categories doesn't exist) */}
                <Link 
                  href="/shop" 
                  className="py-2 px-4 text-slate-700 hover:bg-soft-gray hover:text-medical-blue rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  href="/about" 
                  className="py-2 px-4 text-slate-700 hover:bg-soft-gray hover:text-medical-blue rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/blog" 
                  className="py-2 px-4 text-slate-700 hover:bg-soft-gray hover:text-medical-blue rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  href="/contact" 
                  className="py-2 px-4 text-slate-700 hover:bg-soft-gray hover:text-medical-blue rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {/* Mobile Menu Footer - FIXED LINKS */}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  {/* ✅ FIXED: Wishlist link */}
                  <Link 
                    href="/account/wishlist" 
                    className="flex items-center space-x-3 py-2 px-4 text-slate-700 hover:bg-soft-gray rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>Wishlist</span>
                  </Link>
                  {/* ✅ FIXED: Account link to signin */}
                  <Link 
                    href="/auth/signin" 
                    className="flex items-center space-x-3 py-2 px-4 text-slate-700 hover:bg-soft-gray rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
