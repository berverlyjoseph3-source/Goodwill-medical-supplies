import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Accordion } from '@/components/ui/Accordion';
import { ProductGallery } from './ProductGallery';
import { ProductReviews } from './ProductReviews';
import { RelatedProducts } from './RelatedProducts';
import { useCartStore } from '@/stores/cartStore';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addItem);
  
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success('Added to cart!', {
      icon: '🛒',
      duration: 3000,
      position: 'bottom-center'
    });
  };
  
  return (
    <div className="bg-white">
      <div className="container-padding py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery 
              images={product.images} 
              selectedIndex={selectedImage}
              onSelect={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title & Rating */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-slate-600">
                    {product.reviewCount} reviews
                  </span>
                </div>
                
                <span className="text-sm text-slate-500">|</span>
                
                <span className="text-sm text-slate-600">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Price & Availability */}
            <div className="mb-6">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-slate-800">
                  ${product.salePrice || product.price}
                </span>
                {product.salePrice && (
                  <span className="text-lg text-slate-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.inventory > 10 
                    ? 'bg-subtle-green' 
                    : product.inventory > 0 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  {product.inventory > 10 
                    ? 'In Stock' 
                    : product.inventory > 0 
                    ? `Only ${product.inventory} left` 
                    : 'Out of Stock'
                  }
                </span>
              </div>

              <div className="mt-2 flex items-center text-sm text-slate-600">
                <TruckIcon className="w-5 h-5 mr-2" />
                {product.deliveryEstimate}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-slate-600 mb-6">
              {product.shortDescription}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 
                           flex items-center justify-center hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.inventory}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 h-10 text-center border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  aria-label="Product quantity"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 
                           flex items-center justify-center hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                className="btn-primary flex-1 flex items-center justify-center"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              
              <button
                className="btn-secondary flex-1 flex items-center justify-center"
                aria-label="Request bulk pricing"
              >
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Request Bulk Pricing
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 p-4 bg-soft-gray rounded-lg">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-medical-blue mr-2" />
                <span className="text-sm text-slate-600">FDA Approved</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 text-medical-blue mr-2" />
                <span className="text-sm text-slate-600">2 Year Warranty</span>
              </div>
              <div className="flex items-center">
                <ArrowPathIcon className="w-5 h-5 text-medical-blue mr-2" />
                <span className="text-sm text-slate-600">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <Accordion
            items={[
              {
                title: 'Product Specifications',
                content: (
                  <div className="grid md:grid-cols-2 gap-4 p-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span className="font-medium text-slate-700">{spec.name}</span>
                        <span className="text-slate-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                title: 'Reviews & Ratings',
                content: <ProductReviews productId={product.id} />
              },
              {
                title: 'Shipping & Returns',
                content: (
                  <div className="p-4 space-y-4">
                    <p className="text-slate-600">
                      Free shipping on orders over $500. Standard shipping (3-5 business days) 
                      and express shipping (1-2 business days) available.
                    </p>
                    <p className="text-slate-600">
                      30-day return policy for unused items in original packaging. 
                      Medical devices may have specific return restrictions.
                    </p>
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            You May Also Need
          </h2>
          <RelatedProducts 
            category={product.categoryId} 
            currentProductId={product.id} 
          />
        </div>
      </div>
    </div>
  );
};