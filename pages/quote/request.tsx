import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DocumentTextIcon, 
  ShoppingCartIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { PRODUCTS } from '../../constants/images';
import toast from 'react-hot-toast';

export default function QuoteRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Account Info
    accountType: 'business',
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Address
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Quote Details
    products: [] as any[],
    message: '',
    urgent: false,
    
    // How did you hear?
    referral: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAddProduct = (product: any) => {
    const existing = formData.products.find(p => p.id === product.id);
    
    if (existing) {
      setFormData({
        ...formData,
        products: formData.products.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        ),
      });
      toast.success(`Added another ${product.name}`);
    } else {
      setFormData({
        ...formData,
        products: [...formData.products, { ...product, quantity: 1 }],
      });
      toast.success(`${product.name} added to quote request`);
    }
    
    setSearchQuery('');
    setSearchResults([]);
    setShowProductSearch(false);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    
    setFormData({
      ...formData,
      products: formData.products.map(p =>
        p.id === productId ? { ...p, quantity } : p
      ),
    });
  };

  const handleRemoveProduct = (productId: number) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.id !== productId),
    });
    toast.success('Product removed');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      const results = PRODUCTS
        .filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.sku?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(results);
      setShowProductSearch(true);
    } else {
      setSearchResults([]);
      setShowProductSearch(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Quote request submitted successfully!');
      
      // Reset form
      setFormData({
        accountType: 'business',
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        products: [],
        message: '',
        urgent: false,
        referral: '',
      });
      
      setStep(1);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 2000);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const calculateTotal = () => {
    return formData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="bg-white py-16">
          <div className="container-padding max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Quote Request Received!
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                Thank you for your interest in Goodwill Medical Supplies.
              </p>
              <div className="bg-soft-gray rounded-xl p-6 mb-8 text-left">
                <h2 className="font-semibold text-slate-900 mb-4">What happens next?</h2>
                <ol className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-medical-blue/10 text-medical-blue rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    A sales representative will review your request within 4-6 hours
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-medical-blue/10 text-medical-blue rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                    You'll receive a detailed quote via email with volume-based pricing
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-medical-blue/10 text-medical-blue rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                    Our team can schedule a call to discuss your specific requirements
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-medical-blue/10 text-medical-blue rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                    Once approved, your order will be processed with priority shipping
                  </li>
                </ol>
              </div>
              <Link href="/shop" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white py-12">
        <div className="container-padding max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-medical-blue/10 rounded-full text-medical-blue font-medium text-sm mb-4">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Request a Quote
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Get a Custom Quote
            </h1>
            <p className="text-lg text-slate-600">
              For bulk orders, hospital contracts, and special pricing requests
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${step >= i 
                      ? 'bg-medical-blue text-white' 
                      : 'bg-gray-200 text-slate-600'}`}>
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > i ? 'bg-medical-blue' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-2xl mx-auto mt-2">
              <span className="text-sm font-medium text-slate-600">Account Info</span>
              <span className="text-sm font-medium text-slate-600">Products</span>
              <span className="text-sm font-medium text-slate-600">Review</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors
                        ${formData.accountType === 'business' 
                          ? 'border-medical-blue bg-medical-blue/5 text-medical-blue' 
                          : 'border-gray-300 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="accountType"
                          value="business"
                          checked={formData.accountType === 'business'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                        <span className="font-medium">Business</span>
                      </label>
                      <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors
                        ${formData.accountType === 'individual' 
                          ? 'border-medical-blue bg-medical-blue/5 text-medical-blue' 
                          : 'border-gray-300 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="accountType"
                          value="individual"
                          checked={formData.accountType === 'individual'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <UserIcon className="w-5 h-5 mr-2" />
                        <span className="font-medium">Individual</span>
                      </label>
                    </div>
                  </div>

                  {formData.accountType === 'business' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Company / Organization Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        placeholder="Memorial Hospital"
                      />
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full btn-primary py-3"
                    >
                      Continue to Products
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Products */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Add Products to Quote
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => searchResults.length > 0 && setShowProductSearch(true)}
                        placeholder="Search products by name, category, or SKU..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                      />
                      
                      {/* Search Results Dropdown */}
                      <AnimatePresence>
                        {showProductSearch && searchResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
                                     shadow-xl border border-gray-200 overflow-hidden z-10"
                          >
                            {searchResults.map((product) => (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => handleAddProduct(product)}
                                className="w-full flex items-center p-3 hover:bg-soft-gray transition-colors"
                              >
                                <div className="relative w-10 h-10 bg-soft-gray rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="ml-3 flex-1 text-left">
                                  <p className="text-sm font-medium text-slate-900">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    ${product.price} • {product.category}
                                  </p>
                                </div>
                                <PlusIcon className="w-5 h-5 text-medical-blue" />
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Selected Products */}
                  {formData.products.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-medium text-slate-900">Selected Products</h3>
                      {formData.products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{product.name}</p>
                              <p className="text-xs text-slate-500">${product.price} each</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                                className="px-2 py-1 hover:bg-gray-200 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-10 text-center text-sm font-medium">
                                {product.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                                className="px-2 py-1 hover:bg-gray-200 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-sm text-slate-600">Subtotal:</span>
                        <span className="text-lg font-bold text-slate-900">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-soft-gray rounded-lg">
                      <ShoppingCartIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">No products added yet</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Search and add products to request a quote
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-slate-700 
                               hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={formData.products.length === 0}
                      className="flex-1 btn-primary py-2 disabled:opacity-50"
                    >
                      Review Quote
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address1"
                          required
                          value={formData.address1}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="123 Main St"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          name="address2"
                          value={formData.address2}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="Apt 4B"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="Chicago"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          State / Province *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="IL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          ZIP / Postal Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="60601"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Country *
                        </label>
                        <select
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="MX">Mexico</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Additional Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Special Requirements or Questions
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3">
                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <textarea
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                            placeholder="Tell us about your specific needs, timeline, or any questions..."
                          />
                        </div>
                      </div>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="urgent"
                          checked={formData.urgent}
                          onChange={handleChange}
                          className="w-4 h-4 text-medical-blue border-gray-300 rounded focus:ring-medical-blue"
                        />
                        <span className="ml-2 text-sm text-slate-700">
                          This request is urgent (priority processing)
                        </span>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          How did you hear about us?
                        </label>
                        <select
                          name="referral"
                          value={formData.referral}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        >
                          <option value="">Select an option</option>
                          <option value="search">Search Engine</option>
                          <option value="social">Social Media</option>
                          <option value="referral">Referral</option>
                          <option value="trade">Trade Show</option>
                          <option value="email">Email Newsletter</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quote Summary */}
                  <div className="bg-soft-gray rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Quote Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Products:</span>
                        <span className="font-medium text-slate-900">{formData.products.length} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Estimated Value:</span>
                        <span className="font-bold text-medical-blue">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Account Type:</span>
                        <span className="font-medium text-slate-900 capitalize">{formData.accountType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Delivery Location:</span>
                        <span className="font-medium text-slate-900">
                          {formData.city || 'Not specified'}, {formData.state || ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-slate-700 
                               hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-primary py-2"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        'Submit Quote Request'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
