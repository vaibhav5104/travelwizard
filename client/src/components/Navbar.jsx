import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const {user,notifications, isAuthenticated} = useAuth();
  const admin = user?.isAdmin ?? false;
  const profileMenuRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobileView(window.innerWidth < 768);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);





  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  // Close mobile menu and profile dropdown when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);
  console.log(user)
// console.log("Notifications:", notifications);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine if a nav link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Admin routes
  const adminRoutes = [
    { path: '/admin/cities', label: 'Cities' },
    { path: '/admin/itineraries', label: 'Itineraries' },
    { path: '/admin/add-city', label: 'Add Cities' },
    { path: '/admin/add-itinerary', label: 'Add Itineraries' }
  ];

  // Profile menu items
  const profileMenuItems = [
    { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { path: '/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { path: '/saved-itineraries', label: 'Saved Itineraries', icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z' },
    { path: '/friends', label: 'Friends', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/logout', label: 'Logout', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' }
  ];

  // Bottom dock navigation items
  const dockItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    { 
      path: '/explore', 
      label: 'Explore', 
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    },
    { 
      path: '/city', 
      label: 'Tour', 
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
    },
    { 
      path: '/events', 
      label: 'Events', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      path: '/contact', 
      label: 'Contact', 
      icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    { 
      path: '/about', 
      label: 'About', 
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  return (
    <>
      <nav 
        className={`relative w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white border-gray-200 dark:bg-gray-900 shadow-md py-2' 
            : 'bg-white border-gray-200 dark:bg-gray-900 py-4'
        }`}
      >
        {/* <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
         */}<div className="max-w-screen-xl flex items-center justify-between mx-auto px-4">

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Travel Wizard</span>
          </Link>

          {/* Profile Menu & Mobile Toggle - Right side */}
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* Login/Signup or Profile Button */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={isProfileMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-orange-600 rounded-full"></span>
                  )}
                </button>
                
                {/* Profile Dropdown Menu */}
                <div 
                  className={`z-50 absolute right-0 mt-4 w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 dark:divide-gray-600 ${
                    isProfileMenuOpen ? 'block' : 'hidden'
                  }`}
                >
                  {/* User Info */}
                  {/* <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {user?.username || 'User'}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {user?.email || 'user@example.com'}
                    </span>
                  </div> */}
                  
                  {/* Admin Links in Profile Menu */}
                  {admin && isMobileView && (
                    <div className="py-2 border-b border-gray-100 dark:border-gray-600">
                      <div className="px-4 py-1">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</span>
                      </div>
                      <Link
                          key={'/admin'}
                          to={'/admin'}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {'Admin'}
                        </Link>
                      {adminRoutes.map((route) => (
                        <Link
                          key={route.path}
                          to={route.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {route.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Menu Items */}
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    {profileMenuItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                          </svg>
                          {item.label}
                          {item.label === 'Notifications' && notifications > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {notifications}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`text-white font-medium rounded-lg text-sm px-2 py-2 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 ${
                    location.pathname === '/login' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`text-white font-medium rounded-lg text-sm px-2 py-2 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 ${
                    location.pathname === '/register' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {[
                { path: '/', label: 'Home' },
                { path: '/explore', label: 'Explore' },
                { path: '/city', label: 'Tour' },
                { path: '/events', label: 'Events' },
                { path: '/contact', label: 'Contact' },
                { path: '/about', label: 'About Us' }
              ].map((navItem) => (
                <li key={navItem.path}>
                  <Link
                    to={navItem.path}
                    className={`block py-2 px-3 rounded-md ${
                      isActive(navItem.path)
                        ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                    }`}
                    aria-current={isActive(navItem.path) ? "page" : undefined}
                  >
                    {navItem.label}
                  </Link>
                </li>
              ))}

              {/* Admin Link - Only show if user is admin */}
              {isAuthenticated && admin && (
                <li>
                  <Link
                    to="/admin"
                    className={`block py-2 px-3 rounded-md ${
                      isActive('/admin')
                        ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Admin Navbar - Displayed below the main navbar when user is admin */}
        {isAuthenticated && admin && (
          <div className="max-w-screen-xl mx-auto px-4 mt-1 mb-1 hidden md:block">
            <div className="flex justify-center space-x-6 py-2 px-2 rounded-md bg-indigo-50 dark:bg-gray-800">
              {adminRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`${
                    isActive(route.path)
                      ? 'text-blue-700 dark:text-blue-500'
                      : 'text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500'
                  } text-sm ml-6 font-medium transition-colors duration-300`}
                >
                  {route.label}
                </Link>
              ))}
              {isMobileView && (
                <Link
                    to="/admin"
                    className={`block py-2 px-3 rounded-md ${
                      isActive('/admin')
                        ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                    }`}
                  >
                    Admin
                  </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Bottom Navigation Dock - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-6 h-16">
          {dockItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-blue-600 dark:text-blue-500 transform scale-110'
                  : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500'
              }`}
            >
              <svg 
                className={`w-6 h-6 mb-1 transition-all duration-200 ${
                  isActive(item.path) ? 'scale-110' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
              </svg>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive(item.path) ? 'scale-110 font-semibold' : ''
              }`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;