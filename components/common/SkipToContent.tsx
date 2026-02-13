import React from 'react';

export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-medical-blue text-white px-6 py-3 rounded-lg font-semibold 
                 focus:outline-none focus:ring-4 focus:ring-medical-blue/50 z-50
                 transition-all duration-200"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};
