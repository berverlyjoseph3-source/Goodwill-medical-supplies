import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { MEDICAL_IMAGES } from '../constants/images';
import { LiveChat } from '../components/contact/LiveChat';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ UPDATED: Your Uganda contact information
  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '+256 703 494876',
      subcontent: 'Mon-Fri, 8am-8pm EAT',
      action: 'tel:+256703494876',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'goodwilldiagnosticltd60@gmail.com',
      subcontent: '24/7 support available',
      action: 'mailto:goodwilldiagnosticltd60@gmail.com',
    },
    {
      icon: MapPinIcon,
      title: 'Location',
      content: 'Bombo Rd, Kampala',
      subcontent: '8HPF+33 Kampala, Uganda',
      action: 'https://maps.google.com/?q=Bombo+Rd+Kampala+Uganda',
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      content: 'Monday - Friday',
      subcontent: '8:00 AM - 8:00 PM EAT',
    },
  ];

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns on most items in unused condition. Medical devices may have specific return restrictions due to hygiene regulations.',
    },
    {
      question: 'Do you offer bulk pricing for hospitals?',
      answer: 'Yes! Contact our sales team for volume discounts and custom quotes for healthcare facilities.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 2-3 business days. Express shipping (1-2 days) is available at checkout.',
    },
    {
      question: 'Are your products FDA approved?',
      answer: 'All medical devices sold on our platform are FDA approved and meet strict quality standards.',
    },
  ];

  return (
    <>
      {/* 🚫 REMOVED: Duplicate Header import and component */}
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-medical-blue/5 via-white to-white py-16 md:py-24">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-medical-blue/10 rounded-full text-medical-blue font-medium text-sm mb-6">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                We're Here to{' '}
                <span className="text-medical-blue">Help</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Have questions about our products, need technical support, or ready to place a bulk order? 
                Our medical equipment specialists are available 24/7.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards - UPDATED with your info */}
        <section className="py-12 -mt-12">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-medical-blue/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-medical-blue" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  {item.action ? (
                    <Link 
                      href={item.action}
                      className="text-medical-blue hover:text-medical-blue-dark font-medium text-sm block mb-1"
                    >
                      {item.content}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-slate-900 mb-1">{item.content}</p>
                  )}
                  <p className="text-xs text-slate-500">{item.subcontent}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-soft-gray">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form - EXACTLY AS YOU HAVE IT */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-slate-600 mb-6">
                  We typically respond within 24 hours on business days
                </p>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-600">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Full name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                          placeholder="+256 703 494876"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="Product Inquiry">Product Inquiry</option>
                          <option value="Bulk Order">Bulk Order</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Return/Exchange">Return/Exchange</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                        placeholder="How can we help you today?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Map & Additional Info - UPDATED with your location */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Visit Our Location
                  </h2>
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={MEDICAL_IMAGES.contact.office}
                      alt="Goodwill Medical Supplies - Kampala"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Goodwill Medical Supplies</p>
                      <p className="text-slate-600">Bombo Rd, Kampala</p>
                      <p className="text-slate-600">8HPF+33 Kampala, Uganda</p>
                      <Link 
                        href="https://maps.google.com/?q=Bombo+Rd+Kampala+Uganda"
                        className="inline-block mt-2 text-sm text-medical-blue hover:text-medical-blue-dark font-medium"
                      >
                        Get Directions →
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-slate-900 mb-1">
                          {faq.question}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link 
                      href="/faq"
                      className="text-sm text-medical-blue hover:text-medical-blue-dark font-medium"
                    >
                      View all FAQs →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Chat CTA */}
        <section className="py-16">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-medical-blue to-medical-blue-dark rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Need immediate assistance?
                  </h2>
                  <p className="text-blue-100">
                    Our support team is online and ready to help
                  </p>
                </div>
                <LiveChat>
                  <button className="bg-white text-medical-blue px-8 py-4 rounded-lg font-semibold 
                                   hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl
                                   flex items-center space-x-2">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span>Start Live Chat</span>
                  </button>
                </LiveChat>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* 🚫 REMOVED: Duplicate Footer import and component */}
    </>
  );
}
