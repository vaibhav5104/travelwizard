import React from "react";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* 404 Error TV Design */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-64 h-64 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center justify-center border-4 border-gray-700">
          <div className="absolute -top-5 w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="absolute -top-12 w-6 h-6 bg-gray-600 rounded-full"></div>
          <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-red-500 animate-pulse">NOT FOUND</span>
          </div>
        </div>
        {/* TV Stand */}
        <div className="w-16 h-4 bg-gray-700 mt-4 rounded-md"></div>
      </div>
      {/* 404 Text */}
      <div className="mt-4 text-6xl font-extrabold text-red-500 flex space-x-2">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </div>
    </div>
  );
};
export default Error