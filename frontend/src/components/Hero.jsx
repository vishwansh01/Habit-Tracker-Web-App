import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col bg-[url(/pattern-circles.svg)] bg-contain bg-no-repeat bg-center h-screen w-screen items-center justify-center">
      <div className="text-4xl h-16 font-bold w-fit bg-gradient-to-r from-blue-600 to-white text-transparent bg-clip-text">
        Build Better Habits Together
      </div>
      <div className="text-white font-semibold text-xl">
        Create habits, track your progress daily, and stay accountable with
        friends.
      </div>
      <div className="flex gap-4 my-4">
        {/* <button className=" bg-blue-600 text-white p-2 px-4 font-bold rounded-md hover:bg-blue-700 cursor-pointer">
          Sign Up
        </button> */}
        <Link
          to="/signup"
          className=" bg-blue-600 text-white p-2 px-4 font-bold rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="bg-[#3730a3] text-white p-2 px-4 font-bold rounded-md hover:bg-[#2c2591] cursor-pointer"
        >
          Login
        </Link>
        {/* <button className="bg-[#3730a3] text-white p-2 px-4 font-bold rounded-md hover:bg-[#2c2591] cursor-pointer">
          Login
        </button> */}
      </div>
    </div>
  );
};

export default Hero;
