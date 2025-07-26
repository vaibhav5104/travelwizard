import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../store/auth";


export const Events = () => {
  const [eventCity, setEventCity] = useState("");
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [animateCard, setAnimateCard] = useState(-1);
  const navigate = useNavigate()
  const {FASTAPI} = useAuth()

  // Sample data for popular cities (shown before search)
  const popularCities = [
    {
      name: "Varanasi",
image : "https://images.unsplash.com/photo-1596097825168-c9b773f404ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw4fHxWYXJhbmFzaXxlbnwwfHx8fDE3NDM4NTk2Nzl8MA&ixlib=rb-4.0.3&q=85https://images.unsplash.com/photo-1596097825168-c9b773f404ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw4fHxWYXJhbmFzaXxlbnwwfHx8fDE3NDM4NTk2Nzl8MA&ixlib=rb-4.0.3&q=85",
      events: 4,
    },
    {
      name: "Amritsar",
      image :"https://images.unsplash.com/photo-1599840309126-7ece88628ded?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw5fHxBbXJpdHNhcnxlbnwwfHx8fDE3NDM4NTk2ODJ8MA&ixlib=rb-4.0.3&q=85",
      events: 6,
    },
    {
      name: "Mumbai",
image : "https://images.unsplash.com/photo-1566552881560-0be862a7c445?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHwzfHxNdW1iYWl8ZW58MHx8fHwxNzQzODU5Njc5fDA&ixlib=rb-4.0.3&q=85",
      events: 10,
    },
    {
      name: "Chennai",
image : "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHwxfHxDaGVubmFpfGVufDB8fHx8MTc0Mzg1OTY4OHww&ixlib=rb-4.0.3&q=85",
      events: 9,
    },
  ];

  // Sample upcoming events (shown before search)
  const upcomingEvents = [
    {
      name: "INTERNATIONAL DAY OF YOGA 2025",
      date: "June 21, 2025",
      city: "TamilNadu",
      image : "https://utsav.gov.in/public/uploads/event_picture_image/event_3473/1749634497430212549.jpeg",
      link: "https://utsav.gov.in/"
    },
    {
      name: "SoundRise Sunday at MuSo with AARYA!",
      date: "June 22, 2025",
      city: "Mumbai",
      image: "https://cdn2.allevents.in/thumbs/thumb6850bcf05ed60.jpg",
      link: "https://allevents.in/mobile/amp-event.php?event_id=80003512360264"
    },
    {
      name: "FounderX Global Conference 2025",
      date: "June 20-21, 2025",
      city: "Auroville",
      image : "https://static.wixstatic.com/media/11062b_56c24c91b7134cf3b88c3ad1eb67ecef~mv2.jpg/v1/fill/w_567,h_606,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Large%20Audience.jpg",
      link: "https://www.founderx.club/"    },
  ];

  const eventCategories = ["Festivals", "Concerts", "Exhibitions", "Sports", "Workshops", "Food"];

  const fetchEvents = async () => {
    if (!eventCity) {
      toast.error("City name is required!");
      return;
    }

    setEventLoading(true);
    setError(null);
    setSubmitted(true);

    try {
      const response = await fetch(`${FASTAPI}/events/${eventCity.toLowerCase()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events || []);
      // toast.success(`Found ${data.events?.length || 0} events in ${eventCity}`);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      toast.error("Failed to fetch events. Please try again.");
      setSubmitted(false);
    } finally {
      setEventLoading(false);
    }
  };

  const handleCityClick = (selectedCity) => {
    setEventCity(selectedCity);
  };

  const resetSearch = () => {
    setSubmitted(false);
    setEvents([]);
    setEventCity("");
  };

  const handleViewDetails = (link) => {
    if (!link || typeof link !== "string") {
      toast.error("Invalid URL");
      return;
    }
    const absoluteUrl = link.startsWith("http") ? link : `https://${link}`;
    window.open(absoluteUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    // Reset animation index when events changes
    if (events.length > 0) {
      setAnimateCard(-1);
    }
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-blue-50 overflow-y-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-purple-600 bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Find the most exciting events happening in your favorite destinations
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8 group">
              <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-md group-focus-within:opacity-30 transition-opacity"></div>
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="Enter Destination City (e.g., Dubai, Paris)"
                  onChange={(e) => setEventCity(e.target.value)}
                  value={eventCity}
                  className="w-full py-4 px-6 pr-20 rounded-l-full bg-white/10 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 shadow-lg"
                />
                <button
                  onClick={fetchEvents}
                  disabled={eventLoading}
                  className="rounded-r-full bg-gradient-to-r from-pink-500 to-purple-600 py-4 px-8 font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-70"
                >
                  {eventLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Search</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,80C160,96,320,128,480,128C640,128,800,96,960,80C1120,64,1280,64,1360,64L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Show eventLoading animation */}
        {eventLoading && (
          <div className="text-center py-12 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
              <div className="flex flex-col items-center justify-center">
                {/* Pulse Animation */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-purple-200"></div>
                  <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-t-4 border-purple-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Searching for Events</h3>
                <p className="text-gray-600 mb-4">Looking for amazing events in {eventCity}...</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full w-full animate-pulse"></div>
                </div>
                
                {/* Animated dots */}
                <div className="flex space-x-2 mt-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Display Events after search and not eventLoading */}
        {!eventLoading && submitted && events.length > 0 ? (
          <div className="animate-fadeIn">
            {/* City Header */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transform hover:scale-101 transition-all duration-300">
              <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white">{eventCity}</h2>
              </div>
              <div className="p-8">
                <p className="text-gray-700 leading-relaxed text-lg">Discover amazing events in {eventCity}. From cultural experiences to exciting entertainment, this vibrant destination has something for everyone.</p>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={resetSearch}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Homepage
                  </button>
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="mb-12">
              <div className="flex items-center justify-center mb-10">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 mr-4"></div>
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Exciting Events</h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 ml-4"></div>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event, index) => (
                  <div 
                    key={index}
                    className="group cursor-pointer transition-all duration-300 hover:transform "
                    onMouseEnter={() => setAnimateCard(index)}
                    onMouseLeave={() => setAnimateCard(-1)}
                    onClick={() => handleViewDetails(event.link)}
                  >
                    {/* Vertical rectangle image with hover zoom effect */}
                    <div 
                      className="h-100 rounded-lg overflow-hidden relative mb-3 group"
                    >
                      {/* Image with zoom effect */}
                      <img
                        src={event.image || '/api/placeholder/300/400'}
                        alt="Event"
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      />
                      
                      {/* Elegant shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Animation: Subtle pulse glow effect */}
                      {animateCard === index && (
                        <div className="absolute inset-0 z-10 overflow-hidden rounded-lg">
                          {/* Glow effect */}
                          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-indigo-500/20 to-pink-500/30 rounded-lg blur-xl opacity-60 animate-pulse"></div>
                          
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-8 h-8">
                            <div className="absolute top-0 left-0 w-4 h-0.5 bg-purple-500 animate-[extendRight_0.5s_ease-in-out]"></div>
                            <div className="absolute top-0 left-0 w-0.5 h-4 bg-purple-500 animate-[extendDown_0.5s_ease-in-out]"></div>
                          </div>
                          <div className="absolute top-0 right-0 w-8 h-8">
                            <div className="absolute top-0 right-0 w-4 h-0.5 bg-indigo-500 animate-[extendLeft_0.5s_ease-in-out]"></div>
                            <div className="absolute top-0 right-0 w-0.5 h-4 bg-indigo-500 animate-[extendDown_0.5s_ease-in-out]"></div>
                          </div>
                          <div className="absolute bottom-0 right-0 w-8 h-8">
                            <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-pink-500 animate-[extendLeft_0.5s_ease-in-out]"></div>
                            <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-pink-500 animate-[extendUp_0.5s_ease-in-out]"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-8 h-8">
                            <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-purple-500 animate-[extendRight_0.5s_ease-in-out]"></div>
                            <div className="absolute bottom-0 left-0 w-0.5 h-4 bg-purple-500 animate-[extendUp_0.5s_ease-in-out]"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Event details below the image */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">{event.name || 'Event Name'}</h3>
                    
                    <div className="flex items-center mb-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">{event.location || eventCity}</span>
                    </div>
                    
                    <div className="flex items-center mb-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm text-gray-600">{event.category || 'Category'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{event.price || 'Price'}</span>
                    </div>
                    
                    {/* Floating particles effect on hover */}
                    {animateCard === index && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-purple-400 opacity-70 animate-ping"></div>
                        <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-indigo-400 opacity-70 animate-ping" style={{animationDuration: '1.5s'}}></div>
                        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-pink-400 opacity-70 animate-ping" style={{animationDuration: '2s'}}></div>
                        <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 rounded-full bg-violet-400 opacity-70 animate-ping" style={{animationDuration: '1.8s'}}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>


          </div>
        ) : !eventLoading && submitted && events.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any events in {eventCity}. Please try another city or check back later.</p>
              <button
                onClick={resetSearch}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8">
            {/* Popular Cities Section */}
            <section className="mb-16">
              <div className="flex items-center justify-center mb-10">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 mr-4"></div>
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Popular Cities</h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {popularCities.map((eventCity, index) => (
                  <div 
                    key={index} 
                    className="rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    // onClick={() => handleCityClick(eventCity.name)}
                    onClick={() => navigate(`/city/${eventCity.name}`)}
                  >
                    <div className="relative h-64">
                      <img 
                        src={eventCity.image} 
                        alt={eventCity.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold text-white mb-1">{eventCity.name}</h3>
                        <div className="flex items-center text-white/80">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{eventCity.events} Events</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Upcoming Events Section */}
            <section className="mb-16">
              <div className="flex items-center justify-center mb-10">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 mr-4"></div>
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Featured Events</h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 ml-4"></div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className="flex-1 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-purple-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                        {event.date}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">{event.name}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.city}
                      </div>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50">
                        <div className="flex items-center justify-center">
                          <a href={event.link}>View Details</a>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </button>
                    </div>

                    {/* Corner fold effect */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white via-purple-100 to-purple-200 transform rotate-90 translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-300"></div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Event Categories */}
            <section className="mb-16">
              <div className="flex items-center justify-center mb-10">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 mr-4"></div>
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Event Categories</h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 ml-4"></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {eventCategories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors duration-300">{category}</h3>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Newsletter Subscription */}
            <section>
              <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Event Alerts</h2>
                  <p className="text-purple-100 mb-8">Subscribe to our newsletter and never miss an exciting event in your favorite city!</p>
                  
                  <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-grow py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button className="bg-white text-purple-700 font-medium py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors duration-300 transform hover:scale-105" onClick={() => navigate('/contact')}>
                      Contact
                    </button>
                  </div>
                  
                  <p className="text-purple-200 text-sm mt-4">We'll never share your email with anyone else.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-purple-200 mb-4">We help you discover amazing events happening all around the world. Start exploring today!</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-purple-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-purple-200 hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="text-purple-200 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/events" className="text-purple-200 hover:text-white transition-colors">Popular Events</a></li>
                <li><a href="explore" className="text-purple-200 hover:text-white transition-colors">Top Destinations</a></li>
                <li><a href="/contact" className="text-purple-200 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Top Cities</h3>
              <ul className="space-y-2">
                <li><a href="/city/Shimla" className="text-purple-200 hover:text-white transition-colors">Shimla</a></li>
                <li><a href="/city/Dalhousie" className="text-purple-200 hover:text-white transition-colors">Dalhouise</a></li>
                <li><a href="/city/Mumbai" className="text-purple-200 hover:text-white transition-colors">Mumbai</a></li>
                <li><a href="/city/Amritsar" className="text-purple-200 hover:text-white transition-colors">Amritsar</a></li>
                <li><a href="/city/Varanasi" className="text-purple-200 hover:text-white transition-colors">Varanasi</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-purple-200">support@eventfinder.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-purple-200">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-purple-200">123 Event Street, NY 10001</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-purple-800 text-center">
            <p className="text-purple-300">&copy; {new Date().getFullYear()} Event Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;