import { useState } from "react";
import logo from "../assets/logo.jpeg"; // Adjust the path as necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Image Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-1" />
            <span className="text-gray-600 text-2xl font-bold">Name</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-center ">
            <a
              href="#why-us"
              className="text-gray-600 hover:text-blue-600 transition duration-300 md:mt-2"
            >
              Why Us
            </a>
            <a
              href="#subscribe"
              className="text-gray-600 hover:text-blue-600 transition duration-300 md:mt-2"
            >
              Subscribe Us on Telegram
            </a>
            <a
              href="/query"
              className="bg-blue-600 text-white md:mb-2 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Chat for Free
            </a>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button className="md:hidden text-gray-600" onClick={toggleMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 pb-4">
          <a
            href="#why-us"
            className="block text-gray-600 hover:text-blue-600 px-4 py-2 transition duration-300"
          >
            Why Us
          </a>
          <a
            href="#subscribe"
            className="block text-gray-600 hover:text-blue-600 px-4 py-2 transition duration-300"
          >
            Subscribe Us on Telegram
          </a>
          <a
            href="#chat"
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 mx-4 mt-2"
          >
            Chat for Free
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
