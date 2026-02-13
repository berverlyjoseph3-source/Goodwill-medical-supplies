import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  UsersIcon,
  StarIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';
import { MEDICAL_IMAGES } from '../constants/images';

export default function AboutPage() {
  const stats = [
    { label: 'Years of Service', value: '20+', icon: StarIcon },
    { label: 'Hospitals Served', value: '500+', icon: HeartIcon },
    { label: 'Products', value: '1,200+', icon: ShieldCheckIcon },
    { label: 'Happy Patients', value: '50K+', icon: UsersIcon },
  ];

  const certifications = [
    {
      name: 'FDA Approved',
      description: 'All medical devices meet FDA standards',
      icon: '✅',
    },
    {
      name: 'ISO 13485:2016',
      description: 'Quality management systems for medical devices',
      icon: '🔬',
    },
    {
      name: 'CE Certified',
      description: 'European health, safety, and environmental standards',
      icon: '🇪🇺',
    },
    {
      name: 'HIPAA Compliant',
      description: 'Patient data protection and privacy',
      icon: '🔒',
    },
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
      bio: '20+ years of experience in hospital administration and medical equipment procurement.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      bio: 'Former hospital administrator passionate about making quality medical care accessible.',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Director of Quality Assurance',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
      bio: 'Ensures all products meet rigorous FDA and ISO certification standards.',
    },
    {
      name: 'James Park',
      role: 'Head of Customer Support',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      bio: 'Leading a team of medical equipment specialists available 24/7.',
    },
  ];

  const timeline = [
    {
      year: '2003',
      title: 'Company Founded',
      description: 'Started as a small medical supply store in Chicago',
    },
    {
      year: '2008',
      title: 'FDA Partnership',
      description: 'Became an FDA-registered medical device distributor',
    },
    {
      year: '2012',
      title: 'ISO Certification',
      description: 'Achieved ISO 13485:2012 quality management certification',
    },
    {
      year: '2016',
      title: 'National Expansion',
      description: 'Opened distribution centers on both coasts',
    },
    {
      year: '2020',
      title: 'COVID-19 Response',
      description: 'Delivered 2M+ PPE units to hospitals nationwide',
    },
    {
      year: '2024',
      title: 'Today',
      description: 'Serving 500+ hospitals and 50,000+ home care patients',
    },
  ];

  return (
    <>
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-medical-blue/5 via-white to-white py-16 md:py-24">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-medical-blue/10 rounded-full text-medical-blue font-medium text-sm mb-6">
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Our Story
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                  Committed to{' '}
                  <span className="text-medical-blue">Quality Healthcare</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  For over two decades, Goodwill Medical Supplies has been the trusted partner 
                  for hospitals, clinics, and home care patients across the nation. We don't 
                  just supply equipment – we provide peace of mind.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/shop" className="btn-primary">
                    Browse Products
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={MEDICAL_IMAGES.about.facility}
                  alt="Modern medical facility"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-900">
                    ISO 13485:2016 Certified Facility
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    State-of-the-art quality management system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-soft-gray">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-medical-blue" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-medical-blue/5 to-white rounded-2xl p-8">
                <div className="w-14 h-14 bg-medical-blue rounded-xl flex items-center justify-center mb-6">
                  <HeartIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed">
                  To provide healthcare facilities and home care patients with reliable, 
                  FDA-approved medical equipment at fair prices, backed by exceptional 
                  customer support and expert guidance.
                </p>
              </div>
              <div className="bg-gradient-to-br from-medical-blue/5 to-white rounded-2xl p-8">
                <div className="w-14 h-14 bg-medical-blue rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                <p className="text-slate-600 leading-relaxed">
                  To be the most trusted name in medical supply distribution, 
                  recognized for uncompromising quality, integrity, and our 
                  commitment to improving patient outcomes nationwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-soft-gray">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-slate-600">
                Two decades of growth, innovation, and unwavering commitment to quality
              </p>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-medical-blue/20 hidden lg:block" />
              
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={item.year} className={`flex flex-col lg:flex-row ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    <div className="flex-1" />
                    <div className="flex items-center justify-center lg:w-24">
                      <div className="w-12 h-12 bg-medical-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                        {item.year.slice(-2)}
                      </div>
                    </div>
                    <div className="flex-1 lg:px-8">
                      <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow
                                    ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600">{item.description}</p>
                        <span className="inline-block mt-3 text-sm font-medium text-medical-blue">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 md:py-24">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Our Certifications
              </h2>
              <p className="text-lg text-slate-600">
                We meet the highest standards in medical device quality and safety
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert) => (
                <div key={cert.name} className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{cert.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-slate-600">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-soft-gray">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Leadership Team
              </h2>
              <p className="text-lg text-slate-600">
                Experienced healthcare professionals dedicated to your success
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-medical-blue font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-slate-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-medical-blue to-medical-blue-dark py-16">
          <div className="container-padding max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to equip your facility?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ hospitals and thousands of home care patients who trust Goodwill Medical Supplies
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-medical-blue px-8 py-4 rounded-lg font-semibold 
                         hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold 
                         hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
