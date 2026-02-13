import Image from 'next/image';
import { MEDICAL_IMAGES } from '../../constants/images';

export const ContactHero = () => {
  return (
    <section className="relative bg-medical-blue py-16">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={MEDICAL_IMAGES.contact.office}
          alt="Medical office"
          fill
          className="object-cover opacity-10"
        />
      </div>
      <div className="container-padding max-w-7xl mx-auto relative">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-blue-100">
            Our medical equipment specialists are here to help 24/7
          </p>
        </div>
      </div>
    </section>
  );
};
