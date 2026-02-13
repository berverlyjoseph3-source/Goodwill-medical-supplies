import Image from 'next/image';
import { MEDICAL_IMAGES } from '../../constants/images';

export const AboutHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-medical-blue/5 to-white py-16 md:py-24">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Committed to{' '}
              <span className="text-medical-blue">Quality Healthcare</span>
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              For over 20 years, Goodwill Medical Supplies has been providing hospitals, 
              clinics, and home care patients with reliable, FDA-approved medical equipment.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-medical-blue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-600">ISO 13485:2016 Certified Medical Device Manufacturer</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-medical-blue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-600">FDA Registered and Compliant with All Medical Device Regulations</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-medical-blue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-600">Serving 500+ Hospitals and 10,000+ Home Care Patients</p>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={MEDICAL_IMAGES.about.facility}
              alt="Modern medical facility"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
