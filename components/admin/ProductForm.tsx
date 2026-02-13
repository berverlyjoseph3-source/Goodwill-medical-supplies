import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  XMarkIcon, 
  PlusIcon,
  ArrowUpTrayIcon 
} from '@heroicons/react/24/outline';

interface ProductFormProps {
  categories: any[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const ProductForm = ({ 
  categories, 
  initialData, 
  onSubmit, 
  isSubmitting 
}: ProductFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    sku: initialData?.sku || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    price: initialData?.price || '',
    salePrice: initialData?.salePrice || '',
    inventory: initialData?.inventory || '',
    categoryId: initialData?.categoryId || '',
    brand: initialData?.brand || '',
    tags: initialData?.tags?.join(', ') || '',
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew || false,
    deliveryEstimate: initialData?.deliveryEstimate || '',
    warranty: initialData?.warranty || '',
  });

  const [features, setFeatures] = useState<string[]>(
    initialData?.features || ['']
  );
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || [{ name: '', value: '' }]
  );
  const [images, setImages] = useState(
    initialData?.images?.map((img: any) => img.url) || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  // ✅ FIXED: Added explicit types to filter callback parameters
  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_: any, i: number) => i !== index));
  };

  const handleSpecificationChange = (index: number, field: string, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // In production, upload to cloud storage and get URLs
    // For now, create object URLs
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      inventory: parseInt(formData.inventory),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      features: features.filter(f => f.trim()),
      specifications: specifications.filter(s => s.name && s.value),
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="e.g., Premium Lightweight Wheelchair"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="premium-lightweight-wheelchair"
            />
            <p className="mt-1 text-xs text-slate-500">
              Leave blank to auto-generate from name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              required
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="MW-1001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="Goodwill Medical"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              rows={2}
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="Brief product summary..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Pricing & Inventory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Regular Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sale Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                name="salePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Inventory Quantity *
            </label>
            <input
              type="number"
              name="inventory"
              required
              min="0"
              value={formData.inventory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Category & Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Category & Tags
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category *
            </label>
            <select
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="wheelchair, mobility, medical"
            />
            <p className="mt-1 text-xs text-slate-500">
              Comma-separated tags
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Key Features
          </h2>
          <button
            type="button"
            onClick={handleAddFeature}
            className="text-sm text-medical-blue hover:text-medical-blue-dark font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Feature
          </button>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="e.g., Weight capacity: 300 lbs"
              />
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Specifications
          </h2>
          <button
            type="button"
            onClick={handleAddSpecification}
            className="text-sm text-medical-blue hover:text-medical-blue-dark font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Specification
          </button>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Name"
                value={spec.name}
                onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecification(index)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Product Images
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square bg-soft-gray rounded-lg overflow-hidden group">
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md 
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}

          <label className="aspect-square bg-soft-gray border-2 border-dashed border-gray-300 
                          rounded-lg flex flex-col items-center justify-center cursor-pointer
                          hover:border-medical-blue hover:bg-medical-blue/5 transition-colors">
            <ArrowUpTrayIcon className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs text-slate-600">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Shipping & Warranty */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Shipping & Warranty
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Delivery Estimate
            </label>
            <input
              type="text"
              name="deliveryEstimate"
              value={formData.deliveryEstimate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="2-3 business days"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Warranty
            </label>
            <input
              type="text"
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="2 years"
            />
          </div>
        </div>
      </div>

      {/* Product Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Product Status
        </h2>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-medical-blue border-gray-300 rounded focus:ring-medical-blue"
            />
            <span className="ml-2 text-sm text-slate-700">
              Feature this product on homepage
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="w-4 h-4 text-medical-blue border-gray-300 rounded focus:ring-medical-blue"
            />
            <span className="ml-2 text-sm text-slate-700">
              Mark as new arrival
            </span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-slate-700 
                   hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 btn-primary"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </div>
          ) : (
            'Save Product'
          )}
        </button>
      </div>
    </form>
  );
};