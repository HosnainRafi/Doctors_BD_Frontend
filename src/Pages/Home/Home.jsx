import FeaturedDoctors from '../../components/HomePage/FeaturedDoctors';
import FindYourDoctor from '../../components/HomePage/FindDoctors';
import HealthTipsSection from '../../components/HomePage/HealthTipsSection';
import Hero from '../../components/HomePage/Hero';
import HowItWorks from '../../components/HomePage/HowItWorks';
import PatientTestimonials from '../../components/HomePage/PatientTestimonials';
import SpecializationSection from '../../components/HomePage/SpecializationSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <FindYourDoctor />
      <FeaturedDoctors />
      <SpecializationSection />
      <HowItWorks />
      <HealthTipsSection />
      <PatientTestimonials />
    </div>
  );
};

export default Home;
