import { PRODUCTS } from '@/constants/images';

export async function searchProducts(query: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const results = PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.brand?.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    products: results.slice(0, 10),
    categories: [],
    total: results.length
  };
}

export async function getProduct(id: string) {
  return PRODUCTS.find(p => p.id.toString() === id || p.slug === id);
}

export async function getProducts(filters?: any) {
  return {
    products: PRODUCTS,
    pagination: {
      page: 1,
      limit: 12,
      total: PRODUCTS.length,
      totalPages: Math.ceil(PRODUCTS.length / 12)
    }
  };
}

export async function getCategories() {
  const { CATEGORIES } = await import('@/constants/images');
  return CATEGORIES;
}
