import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <div>
      <div className="bg-gray-50">
        <section className="bg-[#FCF8F1] bg-opacity-30 py-6 md:py-12 ">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <p className="text-base font-semibold tracking-wider text-purple-700 uppercase">
                  Your trusted health partner
                </p>
                <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl">
                  Find the Right Doctor Near You
                </h1>
                <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
                  Search, book, and consult with verified doctors anytime,
                  anywhere.
                </p>

                <Link
                  className="px-6 py-4 mt-2 font-semibold text-white transition-all duration-200 bg-purple-400 rounded-full lg:mt-4 hover:bg-purple-700 focus:bg-purple-700 inline-flex items-center gap-2"
                  role="button"
                >
                  Search Doctors
                  <FaArrowRight />
                </Link>
              </div>

              <div>
                <img
                  className="w-full h-[400px] md:h-[500px]  object-cover rounded-lg "
                  src="https://i.postimg.cc/4dSw6LtP/doctors-fotor-bg-remover-20250717104959.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
