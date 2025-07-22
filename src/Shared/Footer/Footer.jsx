import { FaFacebook, FaInstagramSquare, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navItem = [
    { name: 'Home', path: '/' },
    { name: 'Company', path: '/company' },
    { name: 'Features', path: '/features' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div>
      <footer className="flex flex-col space-y-10 justify-center m-10">
        <nav className="flex justify-center flex-wrap gap-6 text-gray-500 font-medium">
          {navItem.map((item, index) => (
            <Link key={index} className="hover:text-gray-900" to={item.path}>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center space-x-5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-3xl hover:text-[#1877F2] transition" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-3xl hover:text-[#0A66C2] transition" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagramSquare className="text-3xl hover:text-[#E1306C] transition" />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSquareXTwitter className="text-3xl hover:text-black transition" />
          </a>
        </div>
        <p className="text-center text-gray-700 font-medium">
          &copy; 2025 CarePoint. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
