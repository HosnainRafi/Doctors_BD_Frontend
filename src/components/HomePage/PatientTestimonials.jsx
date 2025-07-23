import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Sarah Williams',
    role: 'Patient',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    feedback:
      'CasePoint helped me find the perfect specialist quickly. The booking was seamless and the doctor was amazing!',
    rating: 5,
  },
  {
    name: 'James Carter',
    role: 'Patient',
    photo: 'https://randomuser.me/api/portraits/men/46.jpg',
    feedback:
      'Very easy to use platform with trustworthy doctor profiles. Highly recommend for anyone looking for quality care.',
    rating: 4.5,
  },
  {
    name: 'Emily Johnson',
    role: 'Patient',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    feedback:
      'The reviews and ratings helped me decide confidently. Booking was quick and the appointment was hassle-free.',
    rating: 4,
  },
];

const renderStars = rating => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-5 h-5" />);
    } else if (rating + 0.5 === i) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 w-5 h-5" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400 w-5 h-5" />);
    }
  }
  return stars;
};

const PatientTestimonials = () => {
  return (
    <section className="bg-white py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-purple-700 text-center mb-12">
        Patient Testimonials
      </h2>
      <div className="grid gap-10 md:grid-cols-3">
        {testimonials.map(({ name, role, photo, feedback, rating }, index) => (
          <div
            key={index}
            className="bg-purple-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <p className="text-gray-700 italic mb-6 flex-grow">"{feedback}"</p>
            <div className="flex items-center space-x-4">
              <img
                src={photo}
                alt={name}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-600"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-purple-600">{role}</p>
                <div className="flex mt-1">{renderStars(rating)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientTestimonials;
