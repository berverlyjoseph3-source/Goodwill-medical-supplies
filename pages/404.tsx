import Link from 'next/link';
import { SEO } from '../components/common/SEO';

export default function Custom404() {
  return (
    <>
      <SEO 
        title="404 - Page Not Found | Goodwill Medical Supplies"
        description="The page you are looking for could not be found. Please check the URL or navigate back to our homepage."
        noindex
      />
      
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-white to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Icon */}
          <div className="text-8xl mb-6 animate-pulse">
            🏥
          </div>
          
          {/* 404 Text */}
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-medical-blue/10 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-slate-900">
                Page Not Found
              </span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-lg text-slate-600 mb-8">
            The medical equipment page you're looking for doesn't exist or may have been moved.
            Let's get you back to caring for your patients.
          </p>
          
          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <Link
              href="/shop"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-medical-blue hover:shadow-md transition-all"
            >
              <span className="block text-2xl mb-2">🛒</span>
              <span className="text-sm font-medium text-slate-700">Shop</span>
            </Link>
            
            <Link
              href="/categories"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-medical-blue hover:shadow-md transition-all"
            >
              <span className="block text-2xl mb-2">📋</span>
              <span className="text-sm font-medium text-slate-700">Categories</span>
            </Link>
            
            <Link
              href="/about"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-medical-blue hover:shadow-md transition-all"
            >
              <span className="block text-2xl mb-2">ℹ️</span>
              <span className="text-sm font-medium text-slate-700">About</span>
            </Link>
            
            <Link
              href="/contact"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-medical-blue hover:shadow-md transition-all"
            >
              <span className="block text-2xl mb-2">📞</span>
              <span className="text-sm font-medium text-slate-700">Contact</span>
            </Link>
            
            <Link
              href="/blog"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-medical-blue hover:shadow-md transition-all"
            >
              <span className="block text-2xl mb-2">📰</span>
              <span className="text-sm font-medium text-slate-700">Blog</span>
            </Link>
            
            <Link
              href="/help"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-medical-blue hover:shadow-md transition-all"
            >
              <span className="block text-2xl mb-2">❓</span>
              <span className="text-sm font-medium text-slate-700">Help</span>
            </Link>
          </div>
          
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center text-medical-blue hover:text-medical-blue-dark font-medium group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
