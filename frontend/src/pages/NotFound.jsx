import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/404.json";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-4 text-center">

      {/* 🔥 Animation */}
      <div className="w-[280px] md:w-[400px]">
        <Lottie animationData={animationData} loop={true} />
      </div>

      {/* 🔥 Text */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        Oops! Page not found
      </h1>

      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for might have been removed or does not exist.
      </p>

      {/* 🔥 Button */}
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;