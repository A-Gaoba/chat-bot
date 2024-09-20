import { Link } from "react-router-dom";
import sideImage from "../assets/sider.png";
import backgroundVideo from "../assets/bg.mp4";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Main Content (Hero Section) */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center md:items-stretch bg-white bg-opacity-80 px-4 md:px-16">
        <section className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 w-full">
          {/* Text Content */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <header className="w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                API Interaction Portal
              </h1>
            </header>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
              Welcome to <span className="text-orange-400">Our API</span>{" "}
              Interaction Portal
            </h2>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-gray-600">
              We simplify interactions with our API and deliver data instantly,
              empowering your applications with seamless integration.
            </p>
            <Link
              to="/query"
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
            >
              Get Started
            </Link>
          </div>

          {/* Side Image */}
          <div className="flex-1 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl">
            <img src={sideImage} alt="Side" className="w-full h-auto" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
