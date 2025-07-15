import { FaFacebook, FaInstagramSquare, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navItem = ['home', 'company', 'features', 'team', 'contact'];
  return (
    <div>
      <footer className="flex flex-col space-y-10 justify-center m-10">
        <nav className="flex justify-center flex-wrap gap-6 text-gray-500 font-medium">
          {navItem.map((item, index) => (
            <Link key={index} className="hover:text-gray-900" to="/item">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center space-x-5">
          <Link
            to="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-3xl hover:text-[#1877F2] transition" />
          </Link>

          <Link
            to="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-3xl  hover:text-[#0A66C2] transition" />
          </Link>

          <Link
            to="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagramSquare className="text-3xl hover:text-[#E1306C] transition" />
          </Link>

          <Link
            to="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSquareXTwitter className="text-3xl hover:text-black transition" />
          </Link>
        </div>
        <p className="text-center text-gray-700 font-medium">
          &copy; 2025 CarePoint. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
