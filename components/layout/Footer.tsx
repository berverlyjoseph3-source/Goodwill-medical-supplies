import Link from 'next/link';
import Image from 'next/image';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Mobility Aids', href: '/category/mobility-aids' },
      { name: 'Respiratory Equipment', href: '/category/respiratory' },
      { name: 'Hospital Furniture', href: '/category/hospital-furniture' },
      { name: 'Diagnostic Devices', href: '/category/diagnostic' },
      { name: 'PPE & Disposables', href: '/category/ppe' },
      { name: 'Home Care Supplies', href: '/category/home-care' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Order Tracking', href: '/order/tracking' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Warranty', href: '/warranty' },
      { name: 'FAQs', href: '/faq' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'HIPAA Compliance', href: '/hipaa' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  // ✅ REPLACED with REAL social media logos and YOUR Uganda contact info
  return (
    <footer className="bg-white border-t border-gray-200">

      {/* Main Footer */}
      <div className="container-padding max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Info - UPDATED with your Uganda contact */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <span className="text-xl font-bold text-medical-blue">Goodwill</span>
                <span className="block text-xs text-slate-500 -mt-1">Medical Supplies</span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 mb-4">
              Your trusted partner in medical equipment since 2003. FDA-approved, certified, and delivered with care.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">
                  Bombo Rd, Kampala<br />
                  8HPF+33 Kampala, Uganda
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-medical-blue flex-shrink-0" />
                <a href="tel:+256703494876" className="text-slate-600 hover:text-medical-blue">
                  +256 703 494876
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-medical-blue flex-shrink-0" />
                <a href="mailto:goodwilldiagnosticltd60@gmail.com" className="text-slate-600 hover:text-medical-blue break-all">
                  goodwilldiagnosticltd60@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Shop Links - EXACTLY AS YOU HAVE IT */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-medical-blue transition-colors flex items-center group"
                  >
                    <ChevronRightIcon className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - EXACTLY AS YOU HAVE IT */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-medical-blue transition-colors flex items-center group"
                  >
                    <ChevronRightIcon className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links - EXACTLY AS YOU HAVE IT */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-medical-blue transition-colors flex items-center group"
                  >
                    <ChevronRightIcon className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links - EXACTLY AS YOU HAVE IT */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-medical-blue transition-colors flex items-center group"
                  >
                    <ChevronRightIcon className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - UPDATED with REAL social logos and Uganda info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Goodwill Medical Supplies. Kampala, Uganda.
            </p>
            
            {/* ✅ REPLACED with REAL social media logos */}
            <div className="flex items-center space-x-4">
              {/* WhatsApp - REAL logo */}
              <a
                href="https://wa.me/message/GUIYLLIVSZX2A1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.554 4.128 1.524 5.862L.53 22.523a.75.75 0 00.947.947l4.661-1.004A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.5c-1.847 0-3.592-.5-5.09-1.373l-3.642.785.785-3.642A10.437 10.437 0 011.5 12c0-5.79 4.71-10.5 10.5-10.5S22.5 6.21 22.5 12 17.79 22.5 12 22.5z"/>
                </svg>
              </a>
              
              {/* Facebook - REAL logo */}
              <a
                href="https://www.facebook.com/share/183FFnCEHK/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TikTok - REMOVED (dead link) */}
              
              {/* Email - REAL logo */}
              <a
                href="mailto:goodwilldiagnosticltd60@gmail.com"
                className="text-slate-400 hover:text-medical-blue transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>

            {/* Payment Methods - EXACTLY AS YOU HAVE IT */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">We accept:</span>
              <div className="flex items-center space-x-1">
                <div className="w-10 h-6 bg-slate-200 rounded text-[10px] flex items-center justify-center text-slate-600 font-medium">
                  VISA
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded text-[10px] flex items-center justify-center text-slate-600 font-medium">
                  MC
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded text-[10px] flex items-center justify-center text-slate-600 font-medium">
                  AMEX
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded text-[10px] flex items-center justify-center text-slate-600 font-medium">
                  DISC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
