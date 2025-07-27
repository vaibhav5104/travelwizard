import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-indigo-400 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      <div className="text-center space-y-8 relative z-10">
        {/* Main Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin mx-auto relative">
            <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
          
          {/* Inner Spinning Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin animation-direction-reverse"></div>
          </div>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
          </div>
        </div>

        {/* Travel Icons Animation */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className="animate-bounce delay-0">
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z"/>
            </svg>
          </div>
          <div className="animate-bounce delay-100">
            <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <div className="animate-bounce delay-200">
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exploring Your Journey
          </h2>
          <p className="text-gray-600 text-sm animate-pulse">
            Preparing your travel experience...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-10 -left-10 opacity-20">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute -top-5 -right-8 opacity-20">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping delay-500"></div>
        </div>
        <div className="absolute -bottom-8 -left-6 opacity-20">
          <div className="w-4 h-4 bg-indigo-400 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      {/* Custom Styles for Reverse Animation */}
      <style jsx>{`
        .animation-direction-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default Loader;
