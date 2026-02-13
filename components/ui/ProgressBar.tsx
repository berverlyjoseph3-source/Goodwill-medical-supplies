// components/ui/ProgressBar.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const ProgressBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-medical-blue animate-pulse"
      role="progressbar"
      aria-label="Page is loading"
    >
      <div 
        className="h-full bg-medical-blue-dark w-1/3 animate-slide"
        style={{
          animation: 'slide 1.5s ease-in-out infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
