import FeaturedDoctors from '../../components/HomePage/FeaturedDoctors';
import FindYourDoctor from '../../components/HomePage/FindDoctors';
import Hero from '../../components/HomePage/Hero';

const Home = () => {
  return (
    <div>
      <Hero />
      <FindYourDoctor />
      <FeaturedDoctors />
    </div>
  );
};

export default Home;
