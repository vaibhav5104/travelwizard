import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const parallaxRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial visibility after a short delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll('.observe-section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  const image1 = "https://images.unsplash.com/photo-1579689189009-874f5cac2db5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw0fHxNYW5hbGl8ZW58MHx8fHwxNzQzODU5NjYzfDA&ixlib=rb-4.0.3&q=85";
  const image2 = "https://images.unsplash.com/photo-1561361058-c24cecae35ca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw0fHxWYXJhbmFzaXxlbnwwfHx8fDE3NDM4NTk2Nzl8MA&ixlib=rb-4.0.3&q=85"
  const image3 = "https://images.unsplash.com/photo-1589738611537-4c1b6a28158a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzM0Mzd8MHwxfHNlYXJjaHw4fHxEZWhyYWR1bnxlbnwwfHx8fDE3NDM4NjA0Nzl8MA&ixlib=rb-4.0.3&q=85"
  const image4 = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw4fHxNdW1iYWl8ZW58MHx8fHwxNzQzODU5Njc5fDA&ixlib=rb-4.0.3&q=85"
  
  // Mock data for popular destinations
  const destinations = [
    { id: 1, name: "Manali", state: "Himachal Pradesh", description: "Most popular hill stations in Himachal", image: image1 },
    { id: 2, name: "Varanasi", state: "Uttar Pradesh", description: "The Big Apple", image: image2 },
    { id: 3, name: "Dehradun", state: "Himachal Pradesh", description: "The Heart of Japan", image: image3 },
    { id: 4, name: "Mumbai", state: "Maharashtra", description: "A Beautiful Harbour City", image: image4 },
  ];


  const images = {
    heroBackground: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with actual hero image URL
  }



  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900">
      {/* Hero Section with Simple Background */}
      <header ref={parallaxRef} className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40"></div>
          <img 
            src={images.heroBackground} 
            alt="Scenic travel destination" 
            className="w-full h-full object-cover"
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
            onClick={() => navigate("/explore")}
          >
            Explore Now
          </button>
        </div>

        {/* Scroll indicator with animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm font-light mb-2 text-white">Scroll to explore</span>
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          
          <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Destination Card 1 */}
                        {destinations.map((destination) => (

            <div 
                key={destination.name} // 👈 Add this line
            onClick={() => {navigate(`/city/${destination.name}`)}}
            className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={destination.image}
                  alt={`${destination.name} `} 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-300">{destination.state}</p>
                </div>
              </div>
            </div>
                        ))}
            
            {/* Destination Card 2 */}
            {/* <div className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={images.tokyo} 
                  alt="Tokyo, Japan" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">Tokyo</h3>
                  <p className="text-sm text-gray-300">Japan</p>
                </div>
              </div>
            </div> */}
            
            {/* Destination Card 3 */}
            {/* <div className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={images.newYork} 
                  alt="New York, USA" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">New York</h3>
                  <p className="text-sm text-gray-300">USA</p>
                </div>
              </div>
            </div> */}
            
            {/* Destination Card 4 */}

            {/* <div className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={images.bali} 
                  alt="Bali, Indonesia" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">Bali</h3>
                  <p className="text-sm text-gray-300">Indonesia</p>
                </div>
              </div>
            </div> */}

          </div>
          
          <div className="text-center mt-12">
            <button 
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-md shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate("/explore")}
            >
              View All Destinations
            </button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 observe-section opacity-0 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            What <span className="text-pink-500">Travelers Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">JD</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">John Doe</h4>
                  <p className="text-sm text-gray-500">Adventure Seeker</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"Travel Wizard made planning my Europe trip so easy! The personalized itinerary was perfect, and I discovered places I never would have found on my own."</p>
              <div className="mt-4 text-pink-500">★★★★★</div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">JS</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Family Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"As a mom of three, planning vacations used to be stressful. This app helped me find family-friendly activities and accommodations that everyone loved!"</p>
              <div className="mt-4 text-pink-500">★★★★★</div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">RJ</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"I travel for work constantly, and this app has been a game-changer. It helps me balance work meetings with exploring new cities in my free time."</p>
              <div className="mt-4 text-pink-500">★★★★★</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-900 observe-section opacity-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-pink-50 mb-12">Join thousands of happy travelers and start planning your dream journey today</p>
          <button 
            className="bg-white hover:bg-gray-100 text-pink-600 font-bold py-4 px-10 rounded-md shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate("/explore")}
          >
            Get Started for Free
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Travel Wizard</h3>
            <p className="mb-4">Your ultimate travel companion for discovering and planning unforgettable journeys around the world.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100023434373256" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://x.com/vaibhav5104" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Home</a></li>
              <li><a href="/explore" className="hover:text-pink-500 transition-colors">Destinations</a></li>
              <li><a href="/city" className="hover:text-pink-500 transition-colors">Tours</a></li>
              <li><a href="city" className="hover:text-pink-500 transition-colors">Hotels</a></li>
              <li><a href="events" className="hover:text-pink-500 transition-colors">Activities</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-pink-500 transition-colors">FAQs</a></li>
              <li><a href="/contact" className="hover:text-pink-500 transition-colors">Contact Us</a></li>
              <li><a href="/about" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
              <li><a href="about" className="hover:text-pink-500 transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-pink-500 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Subscribe</h4>
            <p className="mb-4">Get the latest travel deals and updates straight to your inbox.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
              />
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-r-md transition-colors" >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} Travel Wizard. All rights reserved.</p>
        </div>
      </footer>
      
      {/* CSS for animations and effects - simplified */}
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
      `}</style>
    </div>
  );
};
export default Home