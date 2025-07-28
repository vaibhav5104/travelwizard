import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Lazy load heavy components
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const FooterSection = lazy(() => import('./FooterSection'));

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const parallaxRef = useRef(null);
  const observerRef = useRef(null);

  // Optimized image URLs with WebP format and appropriate sizes
  const images = {
    heroBackground: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
    manali: "https://images.unsplash.com/photo-1579689189009-874f5cac2db5?crop=entropy&cs=srgb&fm=webp&ixlib=rb-4.0.3&q=85&w=400",
    varanasi: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?crop=entropy&cs=srgb&fm=webp&ixlib=rb-4.0.3&q=85&w=400",
    dehradun: "https://images.unsplash.com/photo-1589738611537-4c1b6a28158a?crop=entropy&cs=srgb&fm=webp&ixlib=rb-4.0.3&q=85&w=400",
    mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?crop=entropy&cs=srgb&fm=webp&ixlib=rb-4.0.3&q=85&w=400"
  };

  // Mock data for popular destinations
  const destinations = [
    { id: 1, name: "Manali", state: "Himachal Pradesh", description: "Most popular hill stations in Himachal", image: images.manali },
    { id: 2, name: "Varanasi", state: "Uttar Pradesh", description: "The Big Apple", image: images.varanasi },
    { id: 3, name: "Dehradun", state: "Himachal Pradesh", description: "The Heart of Japan", image: images.dehradun },
    { id: 4, name: "Mumbai", state: "Maharashtra", description: "A Beautiful Harbour City", image: images.mumbai },
  ];

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => setScrollY(window.scrollY));
    } else {
      setScrollY(window.scrollY);
    }
  }, []);

  // Handle parallax effect with performance optimization
  useEffect(() => {
    let ticking = false;
    
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial visibility after a short delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    window.addEventListener("scroll", optimizedScrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", optimizedScrollHandler);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Optimized intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-reveal');
              observerRef.current?.unobserve(entry.target);
            }
          });
        });
      } else {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
            observerRef.current?.unobserve(entry.target);
          }
        });
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll('.observe-section');
    sections.forEach(section => {
      observerRef.current?.observe(section);
    });

    return () => {
      if (observerRef.current) {
        sections.forEach(section => {
          observerRef.current?.unobserve(section);
        });
      }
    };
  }, []);

  // Preload critical images
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
      return img;
    };

    // Preload hero image and first destination images
    const criticalImages = [images.heroBackground, images.manali, images.varanasi];
    
    Promise.all(criticalImages.map(preloadImage))
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)); // Set to true even on error to prevent blocking
  }, []);

  const navigateToExplore = useCallback(() => navigate("/explore"), [navigate]);
  const navigateToCity = useCallback((cityName) => navigate(`/city/${cityName}`), [navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900">
      {/* Hero Section with Optimized Background */}
      <header ref={parallaxRef} className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40"></div>
          <img 
            src={images.heroBackground}
            alt="Scenic travel destination - mountains and lake view" 
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            width="800"
            height="600"
            onLoad={() => setImagesLoaded(true)}
          />
        </div>
        
        {/* Hero Content with Animations */}
        <div 
          className={`relative z-20 max-w-4xl mx-auto transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Welcome to <span className="font-extrabold">Travel Wizard</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-10 text-pink-100">
            YOUR ULTIMATE TRAVEL COMPANION
          </h2>
          <button 
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-md shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={navigateToExplore}
            aria-label="Explore travel destinations"
          >
            Explore Now
          </button>
        </div>

        {/* Scroll indicator with animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm font-light mb-2 text-white">Scroll to explore</span>
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </header>
      
      {/* Features Section with Simple Cards */}
      <section className="max-w-6xl mx-auto py-20 px-4 observe-section opacity-0 bg-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Discover Your Next <span className="text-pink-500">Adventure</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="h-48 flex items-center justify-center p-8 bg-pink-50">
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Tours</h3>
              <p className="text-gray-600">Discover curated tours in the world's most breathtaking destinations. Expert guides, unforgettable experiences.</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="h-48 flex items-center justify-center p-8 bg-pink-50">
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plan Itineraries</h3>
              <p className="text-gray-600">Personalized travel plans tailored to your budget, interests, and schedule. Maximize every moment of your journey.</p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="h-48 flex items-center justify-center p-8 bg-pink-50">
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Events</h3>
              <p className="text-gray-600">From local festivals to hidden gems, stay updated on exciting events happening around your destination.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Destinations Preview */}
      <section className="py-20 px-4 bg-gray-100 observe-section opacity-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Popular <span className="text-pink-500">Destinations</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div 
                key={destination.id}
                onClick={() => navigateToCity(destination.name)}
                className="destination-card group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigateToCity(destination.name);
                  }
                }}
                aria-label={`Explore ${destination.name}, ${destination.state}`}
              >
                <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                  <img 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={destination.image}
                    alt={`${destination.name}, ${destination.state} - ${destination.description}`}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    width="400"
                    height="500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                    <p className="text-sm text-gray-300">{destination.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-md shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={navigateToExplore}
              aria-label="View all travel destinations"
            >
              View All Destinations
            </button>
          </div>
        </div>
      </section>
      
      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <TestimonialsSection />
      </Suspense>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-900 observe-section opacity-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-pink-50 mb-12">Join thousands of happy travelers and start planning your dream journey today</p>
          <button 
            className="bg-white hover:bg-gray-100 text-pink-600 font-bold py-4 px-10 rounded-md shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={navigateToExplore}
            aria-label="Get started with Travel Wizard for free"
          >
            Get Started for Free
          </button>
        </div>
      </section>
      
      <Suspense fallback={<div className="py-12 text-center">Loading footer...</div>}>
        <FooterSection />
      </Suspense>
      
      {/* Optimized CSS for animations and effects */}
      <style jsx>{`
        .animate-reveal {
          animation: reveal 0.8s ease forwards;
        }
        
        @keyframes reveal {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Prevent layout shift */
        .destination-card img {
          min-height: 100%; /* Full container height */
        }
        
        /* Optimize animations for better performance */
        .group:hover .group-hover\\:scale-110 {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Home;