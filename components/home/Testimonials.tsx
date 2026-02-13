import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { StarIcon } from '@heroicons/react/24/solid';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Default testimonials in case none are provided
const defaultTestimonials = [
  {
    id: 1,
    name: 'Dr. Joel M',
    role: 'Chief of Surgery',
    hospital: 'Memorial Hospital',
    image: '/images/testimonials/doctor1.jpg',
    content: 'Goodwill Medical Supplies has been our trusted partner for over a decade. Their equipment quality and customer service are exceptional.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Charlotte H',
    role: 'Home Care Patient',
    image: '/images/testimonials/patient1.jpg',
    content: 'The home care equipment I purchased has greatly improved my quality of life. Professional service from start to finish.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Javier K',
    role: 'Clinic Director',
    hospital: 'Community Health Center',
    image: '/images/testimonials/doctor2.jpg',
    content: 'Reliable supplier with competitive pricing. Their diagnostic devices are top-notch and very accurate.',
    rating: 5,
  },
];

export const Testimonials = ({ testimonials }: { testimonials?: typeof defaultTestimonials }) => {
  // ✅ FIX: Use default testimonials if none are provided
  const displayTestimonials = testimonials || defaultTestimonials;

  // ✅ FIX: Guard against empty array
  if (!displayTestimonials || displayTestimonials.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-12"
    >
      {displayTestimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id}>
          <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.image || '/images/placeholder.jpg'}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{testimonial.name}</h3>
                <p className="text-sm text-slate-500">
                  {testimonial.role}
                  {testimonial.hospital && `, ${testimonial.hospital}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            
            <p className="text-slate-600 flex-1">"{testimonial.content}"</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
