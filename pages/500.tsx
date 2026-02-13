import Link from 'next/link';
import { SEO } from '../components/common/SEO';

export default function Custom500() {
  return (
    <>
      <SEO 
        title="500 - Server Error | Goodwill Medical Supplies"
        description="We're experiencing technical difficulties. Our medical equipment specialists have been notified and are working to resolve the issue."
        noindex
      />
      
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-white to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 500 Icon */}
          <div className="text-8xl mb-6 animate-pulse">
            ⚕️
          </div>
          
          {/* 500 Text */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Something Went Wrong
          </h1>
          
          {/* Description */}
          <p className="text-lg text-slate-600 mb-8">
            Our medical equipment specialists have been notified and are working to fix the issue.
            Please try again in a few minutes.
          </p>
          
          {/* Status Indicator */}
          <div className="bg-soft-gray rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
            <p className="text-sm text-slate-600">
              System Status: <span className="font-medium text-slate-900">Investigating</span>
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
            
            <Link
              href="/"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Go Home
            </Link>
          </div>
          
          {/* Support Contact */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-slate-500">
              Need immediate assistance?{' '}
              <Link href="/contact" className="text-medical-blue hover:underline font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
