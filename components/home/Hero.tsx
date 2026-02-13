import Link from 'next/link';
import Image from 'next/image';
import { MEDICAL_IMAGES } from '../../constants/images';

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-medical-blue/5 via-white to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      <div className="container-padding max-w-7xl mx-auto relative py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-medical-blue/10 rounded-full text-medical-blue font-medium text-sm">
              <span className="w-2 h-2 bg-medical-blue rounded-full mr-2"></span>
              Trusted by 500+ Hospitals
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Quality Medical Equipment{' '}
              <span className="text-medical-blue relative">
                You Can Trust
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 4">
                  <line x1="0" y1="2" x2="100" y2="2" stroke="#0070f3" strokeWidth="2" strokeDasharray="4 4"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-lg">
              FDA-approved, certified equipment for hospitals, clinics, and home care. 
              Fast shipping and professional support from medical experts.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary group">
                Shop Now
                <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/quote" className="btn-secondary">
                Request a Quote
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">FDA Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">Fast Shipping</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Real Image */}
          <div className="relative lg:block animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={MEDICAL_IMAGES.hero.doctorPatient}
                alt="Doctor consulting with patient"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-medical-blue/20 to-transparent"></div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-soft p-4 max-w-[200px] hidden md:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-medical-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">15K+</p>
                    <p className="text-xs text-slate-500">Happy Patients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
