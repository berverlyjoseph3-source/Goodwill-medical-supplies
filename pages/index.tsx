import { Hero } from '../components/home/Hero';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { TrustBadges } from '../components/home/TrustBadges';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Trust Badges Section */}
      <section className="bg-soft-gray py-12 border-y border-gray-200">
        <div className="container-padding max-w-7xl mx-auto">
          <TrustBadges />
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="section-spacing">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-slate-600">
                Find exactly what you need from our wide selection
              </p>
            </div>
            <Link 
              href="/shop" 
              className="text-medical-blue hover:text-medical-blue-dark font-semibold flex items-center group"
            >
              Browse All
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <FeaturedCategories />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-spacing bg-soft-gray">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Featured Products
              </h2>
              <p className="text-slate-600">
                Our most popular medical equipment and supplies
              </p>
            </div>
            <Link 
              href="/shop" 
              className="text-medical-blue hover:text-medical-blue-dark font-semibold flex items-center group"
            >
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-slate-600 text-lg">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ✅ KEEP ONLY THIS NEWSLETTER SECTION (the one below) */}
      <section className="py-16 bg-soft-gray">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12">
            <Newsletter />
          </div>
        </div>
      </section>
    </main>
  );
}
