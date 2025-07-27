import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const {user, isAuthenticated} = useAuth();
  const admin = user?.isAdmin ?? false;
  const profileMenuRef = useRef(null);

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

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white border-gray-200 dark:bg-gray-900 shadow-md py-2' 
            : 'bg-white border-gray-200 dark:bg-gray-900 py-4'
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
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
                  {user?.notifications && user.notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {/* Profile Dropdown Menu */}
                <div 
                  className={`z-50 absolute right-0 mt-4 w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 dark:divide-gray-600 ${
                    isProfileMenuOpen ? 'block' : 'hidden'
                  }`}
                >
                  {/* User Info */}
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {user?.name || 'User'}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                  
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
                          {item.label === 'Notifications' && user?.notifications && user.notifications.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {user.notifications.length}
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
                  className={`text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 ${
                    location.pathname === '/login' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 ${
                    location.pathname === '/register' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                {isMobileMenuOpen ? (
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                ) : (
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                )}
              </svg>
            </button>
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
                  } text-sm font-medium transition-colors duration-300`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800">
            {['/', '/explore', '/city', '/events', '/contact' , 'about'].map((path, index) => {
              const labels = ['Home', 'Explore', 'Tour', 'Events', 'Contact','About Us' ];
              return (
                <Link
                  key={path}
                  to={path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(path)
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {labels[index]}
                </Link>
              );
            })}

            {/* Admin Link for Mobile - Only show if user is admin */}
            {isAuthenticated && admin && (
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/admin')
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                }`}
              >
                Admin
              </Link>
            )}

            {/* Admin Mobile Menu Links */}
            {isAuthenticated && admin && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1">Admin Tools</p>
                  {adminRoutes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(route.path)
                          ? 'bg-blue-700 text-white'
                          : 'text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Profile Menu */}
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-3 mb-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                      {item.label}
                      {item.label === 'Notifications' && user?.notifications && user.notifications.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {user.notifications.length}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2 px-3">
                  <Link to="/login" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium dark:text-gray-200 dark:hover:bg-gray-700">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Adding space to accommodate the fixed navbar */}
      <div className={`h-16 ${isAuthenticated && admin ? 'md:h-28' : 'md:h-16'}`}></div>
    </>
  );
};
export default Navbar