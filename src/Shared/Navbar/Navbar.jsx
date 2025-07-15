import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItem = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'chat', label: 'Chat With Assistant', path: '/chat-with-assistant' },
    { key: 'contact', label: 'Contact', path: '/contact' },
  ];

  return (
    <div className='fixed top-0 w-full left-0 z-50'>
      <nav className="border-gray-200 py-2.5 bg-gray-900">
        <div className="flex flex-wrap items-center justify-between max-w-7xl px-4 mx-auto">
          <NavLink to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Care<span className="text-red-700 font-bold">P</span>oint
            </span>
          </NavLink>

          <div className="flex items-center lg:order-2">
            <div className="hidden mt-2 mr-4 sm:inline-block">
              <span></span>
              <button
                type="button"
                className="ml-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition"
              >
                Appointment
              </button>
            </div>
            <button
              className="text-white text-2xl lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <GiHamburgerMenu />
            </button>
          </div>

          <div
            className={`${
              menuOpen ? 'block' : 'hidden'
            } items-center justify-between w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {navItem.map(item => (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block py-2 pl-3 pr-4 rounded lg:p-0 ${
                        isActive
                          ? 'text-white bg-purple-700 lg:bg-transparent lg:text-purple-700'
                          : 'text-white lg:text-gray-300 hover:text-purple-500'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
