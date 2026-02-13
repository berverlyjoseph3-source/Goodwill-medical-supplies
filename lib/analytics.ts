// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce tracking
export const ecommerce = {
  // Product view
  viewProduct: (product: any) => {
    event({
      action: 'view_item',
      category: 'Ecommerce',
      label: product.name,
    });
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: product.salePrice || product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            price: product.salePrice || product.price,
            quantity: 1,
          },
        ],
      });
    }
  },
  
  // Add to cart
  addToCart: (product: any, quantity: number) => {
    event({
      action: 'add_to_cart',
      category: 'Ecommerce',
      label: product.name,
      value: (product.salePrice || product.price) * quantity,
    });
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: (product.salePrice || product.price) * quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            price: product.salePrice || product.price,
            quantity,
          },
        ],
      });
    }
  },
  
  // Begin checkout
  beginCheckout: (cart: any) => {
    event({
      action: 'begin_checkout',
      category: 'Ecommerce',
      label: 'Checkout Started',
      value: cart.subtotal,
    });
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: cart.subtotal,
        items: cart.items.map((item: any) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  },
  
  // Purchase
  purchase: (order: any) => {
    event({
      action: 'purchase',
      category: 'Ecommerce',
      label: `Order ${order.orderNumber}`,
      value: order.total,
    });
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: order.orderNumber,
        affiliation: 'Goodwill Medical Supplies',
        value: order.total,
        tax: order.tax,
        shipping: order.shippingCost,
        currency: 'USD',
        items: order.items.map((item: any) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  },
};

// Custom events
export const customEvents = {
  // Search
  search: (query: string, resultsCount: number) => {
    event({
      action: 'search',
      category: 'Engagement',
      label: query,
      value: resultsCount,
    });
  },
  
  // Newsletter signup
  newsletterSignup: (email: string) => {
    event({
      action: 'newsletter_signup',
      category: 'Conversion',
      label: email,
    });
  },
  
  // Quote request
  quoteRequest: (products: any[], total: number) => {
    event({
      action: 'quote_request',
      category: 'Conversion',
      label: `${products.length} items`,
      value: total,
    });
  },
  
  // Error tracking
  error: (error: Error, context?: string) => {
    event({
      action: 'error',
      category: 'Error',
      label: `${context || 'App'}: ${error.message}`,
    });
  },
};
