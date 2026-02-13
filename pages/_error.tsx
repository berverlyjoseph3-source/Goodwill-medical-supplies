import { NextPageContext } from 'next';
import Link from 'next/link';
import { SEO } from '../components/common/SEO';

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

export default function ErrorPage({ statusCode = 500, message }: ErrorPageProps) {
  const errorMessages = {
    404: {
      title: 'Page Not Found',
      description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      icon: '🔍',
    },
    500: {
      title: 'Internal Server Error',
      description: 'Something went wrong on our end. Please try again later or contact support if the problem persists.',
      icon: '⚕️',
    },
    403: {
      title: 'Access Denied',
      description: 'You do not have permission to access this page. Please check your credentials and try again.',
      icon: '🔒',
    },
    401: {
      title: 'Unauthorized',
      description: 'Please sign in to access this page.',
      icon: '🔑',
    },
  };

  const error = errorMessages[statusCode as keyof typeof errorMessages] || errorMessages[500];

  return (
    <>
      <SEO 
        title={`${statusCode} - ${error.title} | Goodwill Medical Supplies`}
        description={error.description}
        noindex
      />
      
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-white to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Error Icon */}
          <div className="text-8xl mb-6 animate-bounce">
            {error.icon}
          </div>
          
          {/* Error Code */}
          <div className="text-7xl md:text-8xl font-bold text-medical-blue mb-4">
            {statusCode}
          </div>
          
          {/* Error Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {error.title}
          </h1>
          
          {/* Error Message */}
          <p className="text-lg text-slate-600 mb-8">
            {message || error.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            
            <Link
              href="/contact"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </Link>
          </div>
          
          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-slate-500">
              Need immediate assistance? Call us at{' '}
              <a href="tel:+18001234567" className="text-medical-blue hover:underline font-medium">
                +1 (800) 123-4567
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : undefined;
  return { statusCode, message };
};
