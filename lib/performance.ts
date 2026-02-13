// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  // Send to Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      event_category: 'Web Vitals',
    });
  }
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }
}

// Performance marks
export const perf = {
  mark: (name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        const duration = entries[0]?.duration;
        
        if (duration && process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        }
        
        // Send to analytics
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'performance', {
            event_category: 'Performance',
            event_label: name,
            value: Math.round(duration),
          });
        }
      } catch (e) {
        // Ignore measurement errors
      }
    }
  },
  
  clear: (name?: string) => {
    if (typeof window !== 'undefined') {
      if (name) {
        performance.clearMarks(name);
        performance.clearMeasures(name);
      } else {
        performance.clearMarks();
        performance.clearMeasures();
      }
    }
  },
};

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  if (typeof window === 'undefined') return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
};

// Prefetch critical pages
export const prefetchPages = () => {
  if (typeof window === 'undefined') return;
  
  const pages = [
    '/shop',
    '/about',
    '/contact',
  ];
  
  pages.forEach((page) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    link.as = 'document';
    document.head.appendChild(link);
  });
};

// Cache API responses
export const cacheAPI = {
  set: async (key: string, data: any, ttl: number = 300) => {
    const item = {
      data,
      expiry: Date.now() + (ttl * 1000),
    };
    
    try {
      localStorage.setItem(`api_${key}`, JSON.stringify(item));
      return true;
    } catch (e) {
      return false;
    }
  },
  
  get: async (key: string) => {
    try {
      const item = localStorage.getItem(`api_${key}`);
      if (!item) return null;
      
      const { data, expiry } = JSON.parse(item);
      
      if (Date.now() > expiry) {
        localStorage.removeItem(`api_${key}`);
        return null;
      }
      
      return data;
    } catch (e) {
      return null;
    }
  },
  
  clear: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('api_')) {
        localStorage.removeItem(key);
      }
    });
  },
};
