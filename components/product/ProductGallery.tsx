import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ProductGalleryProps {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  productName: string;
}

export const ProductGallery = ({ 
  images, 
  selectedIndex, 
  onSelect, 
  productName 
}: ProductGalleryProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handlePrevImage = () => {
    onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNextImage = () => {
    onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  // If no images, show placeholder
  const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-soft-gray rounded-2xl overflow-hidden cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={displayImages[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                  : undefined
              }
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 
                       rounded-full shadow-lg flex items-center justify-center
                       hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 
                       rounded-full shadow-lg flex items-center justify-center
                       hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`relative aspect-square rounded-lg overflow-hidden
                       border-2 transition-all ${
                         selectedIndex === index
                           ? 'border-medical-blue'
                           : 'border-transparent hover:border-medical-blue/50'
                       }`}
              aria-label={`View image ${index + 1}`}
              aria-selected={selectedIndex === index}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
