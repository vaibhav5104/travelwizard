import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { useNavigate,Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Hotel, Clock } from 'lucide-react';

const Tour = () => {
    const [city, setCity] = useState("");
    const [finalCity, setFinalCity] = useState(null);
    const [itinerary, setItinerary] = useState(null);
    const [isFinal, setIsFinal] = useState(false);
    const [isTourSubmit, setIsTourSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('places');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState('right');    
    const [popularDestinations, setPopularDestinations] = useState([
        { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
        { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245" },
        { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9" },
        { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
    ]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [weatherData, setWeatherData] = useState(null);

    //event states
    const [eventCity, setEventCity] = useState("");
    const [events, setEvents] = useState([]);
    const [eventLoading, setEventLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [animateCard, setAnimateCard] = useState(-1);

    const { user,API, F_API,FASTAPI ,authorizationToken} = useAuth();
    const [budget, setBudget] = useState("");
    const [days, setDays] = useState("");
    const navigate = useNavigate();
    const noVal = " ";

    //saved itineraries
    const [savedItineraries, setSavedItineraries] = useState([]);
    const [loadingSavedItineraries, setLoadingSavedItineraries] = useState(false);

    //ownerInfo
    // const [owner,setOwner] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [recommendedItineraries,setRecommendedItineraries] = useState([])

// Fix default marker icon issue in Leaflet
const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  // Day-colored marker icons for the map
  const createDayIcon = (day) => {
    // Colors for different days
    const colors = [
      "#4299E1", // blue-500
      "#48BB78", // green-500
      "#ED8936", // orange-500
      "#9F7AEA", // purple-500
      "#F56565", // red-500
      "#667EEA", // indigo-500
      "#38B2AC"  // teal-500
    ];
  
    return new L.DivIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${colors[day % colors.length]}; 
            color: white; 
            width: 30px; 
            height: 30px; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            border-radius: 50%; 
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
              ${day}
            </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };
  
  // Enhanced Tour Itinerary Component
    
    // Reference to the map element for scrolling
    const mapSectionRef = useRef(null);
    
    // State to track the active itinerary for map display
    const [activeItineraryIndex, setActiveItineraryIndex] = useState(0);
    const [mapKey, setMapKey] = useState(0); // Force map re-render when itinerary changes
  
    // Reset map when itinerary changes
    useEffect(() => {
      setMapKey(prevKey => prevKey + 1);
    }, [activeItineraryIndex, itinerary]);
  
    // Get all valid places with coordinates for the active itinerary
    const getValidPlaces = () => {
      if (!itinerary || !itinerary[activeItineraryIndex]) return [];
      
      return (itinerary[activeItineraryIndex].selectedPlaces || [])
        .filter(place => place.latitude && place.longitude);
    };
  
    // Get map bounds based on places
    const getMapBounds = () => {
      const validPlaces = getValidPlaces();
      if (validPlaces.length === 0) return null;
      
      return validPlaces.map(place => [place.latitude, place.longitude]);
    };
  
    // Get place details by name (used for daily plan)
    const getPlaceByName = (name) => {
      if (!itinerary || !itinerary[activeItineraryIndex]) return null;
      
      return (itinerary[activeItineraryIndex].selectedPlaces || [])
        .find(place => place.name === name);
    };
  
    // Get day number for a place (used for the map icons)
    const getDayForPlace = (placeName) => {
      if (!itinerary || !itinerary[activeItineraryIndex]) return 0;
      
      const dailyPlan = itinerary[activeItineraryIndex].dailyPlan || [];
      
      for (let i = 0; i < dailyPlan.length; i++) {
        if (dailyPlan[i].places && dailyPlan[i].places.includes(placeName)) {
          return dailyPlan[i].day;
        }
      }
      
      return 0; // Default if not found
    };
  
    // Scroll to map section when "View on Map" is clicked
    const scrollToMap = () => {
      if (mapSectionRef.current) {
        mapSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };
  
    // if (!isTourSubmit || !itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    //   return isTourSubmit ? (
    //     <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600 text-lg mt-8 max-w-2xl mx-auto">
    //       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    //       </svg>
    //       <p className="font-medium">No matching itineraries found for your selected city, budget, and days.</p>
    //       <p className="mt-2 text-base text-red-500">Try adjusting your search criteria or explore our suggested destinations.</p>
    //     </div>
    //   ) : null;
    // }
  


    // Load search history from localStorage on component mount
    useEffect(() => {
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    // Simulate weather data fetch for the selected city
    useEffect(() => {
        if (finalCity) {
            // This would be a real API call in production
            setWeatherData({
                temp: Math.floor(Math.random() * 30) + 10,
                condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
                humidity: Math.floor(Math.random() * 70) + 30
            });
        }
    }, [finalCity]);

    //event functions 
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
        // toast.info("Events will be available Soon!");
//         toast("Events Coming soon!", {
//   type: "info",
//   icon: "⏳",
// });
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

      const handleCityChange = (e) => {
        setEventCity(e.target.value);
        setCity(e.target.value);
    };

    const handlePopularDestinationClick = (cityName) => {
        setCity(cityName);
    };

    const handleClick = (url) => {
        if (!url || typeof url !== "string") {
            toast.error("Invalid URL");
            return;
        }

        const absoluteUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
        try {
            window.open(absoluteUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            toast.error("Unable to open URL");
        }
    };

const capitalizeCity = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const onSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!city.trim()) {
        toast.error("Please enter a city name");
        return;
    }

    const formattedCity = capitalizeCity(city.trim());
    
    setLoading(true);
    try {
        const response = await fetch(`${API}/api/tour/city/${formattedCity}`);
        if (response.ok) {
            const cityData = await response.json();
            setIsFinal(true);
            setEventLoading(true);
            setSubmitted(true);
            setError(null);
            setFinalCity(cityData.city);

            const updatedHistory = [formattedCity, ...searchHistory.filter(item => item !== formattedCity)].slice(0, 5);
            setSearchHistory(updatedHistory);
            localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        } else {
            toast.error(`${formattedCity} ${response.statusText}`);
        }
    } catch (error) {
        toast.error(`Error fetching city data: ${error.message}`);
    } finally {
        setLoading(false);
    }
};

    
    const tourSubmit = async (e) => {
        e.preventDefault();
        if (!budget || !days) {
            toast.error("Both budget and days are required!");
            return;
        }

        try {
            const response = await fetch(`${API}/api/itineraries/filter?city=${city}&budget=${budget}&days=${days}`);
            if (response.ok) {
                const itineraryData = await response.json();
                setIsTourSubmit(true);
                setItinerary(itineraryData);
                // console.log("Itenerary is  : ",itineraryData);
                
                // Smooth scroll to itinerary section
                document.getElementById('itinerary-section')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                toast.error("Error fetching itinerary data");
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Handle print functionality
    const handlePrint = () => {
      window.print();
    };

    const handleShareItinerary = (item) => {
      const shareUrl = `${F_API}/it/${item._id}`;
    
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Share link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy link: ', err);
          toast.error('Failed to copy the link. Try again.');
        });
    }

    const handleCardClick = (id) => {
  setSelectedId(prev => (prev === id ? null : id));
};

    useEffect(() => {
  const handleRecommendedItineraries = async () => {
    try {
      const response = await fetch(`${API}/api/itineraries/${itinerary[0]._id}/recommendations`);
      const res_data = await response.json();

      if (!response.ok) {
        console.log("Recommended itineraries response is not ok");
        return;
      }

      const enrichedItineraries = await Promise.all(res_data.map(async (item) => {
        try {
          const cityRes = await fetch(`${API}/api/tour/city/${encodeURIComponent(item.city)}`);
          if (!cityRes.ok) throw new Error(`Failed to fetch city image for ${item.city}`);
          const cityData = await cityRes.json();
          return {
            ...item,
            cityImage: cityData.city.cityImage[0] || null,
          };
        } catch (err) {
          console.error("City image fetch error:", err);
          return { ...item, cityImage: null };
        }
      }));

      setRecommendedItineraries(enrichedItineraries);
      // console.log("Recommended itineraries with images:", enrichedItineraries);
    } catch (error) {
      console.log("handleRecommendedItineraries error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (Array.isArray(itinerary) && itinerary.length > 0 && itinerary[0]?._id) {
    handleRecommendedItineraries();
  }
}, [itinerary]);

// Fetch user's saved itineraries when component mounts and user is logged in
  useEffect(() => {
    if (user) {
      fetchSavedItineraries();
    }
  }, [user]);

  const fetchSavedItineraries = async () => {
    try {
      setLoadingSavedItineraries(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/itineraries/clone`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedItineraries(data.map(item => item._id));
      }
    } catch (error) {
      console.error('Error fetching saved itineraries:', error);
    } finally {
      setLoadingSavedItineraries(false);
    }
  };

  const cloneItinerary = async (id) => {
    // if (!user) {
    //   toast.info("Please login to save itineraries");
    //   return;
    // }

    try {
      const response = await fetch(`${API}/api/itineraries/clone`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          "authorization": authorizationToken
        },
        body: JSON.stringify({ publicItineraryId: id })
      });

      const res_data = await response.json();
      console.log("Cloned Itinerary:", res_data);

      if (response.ok) {
        toast.success("Itinerary cloned successfully");
        // Add the cloned itinerary to saved list
        setSavedItineraries(prev => [...prev, id]);
      } else {
        console.log("Response error");
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (error) {
      console.log("try error", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Check if an itinerary is already saved by the user
  const isItinerarySaved = (itineraryId) => {
    return savedItineraries.includes(itineraryId);
  };

  // Check if the user owns this itinerary
  const isOwnerOfItinerary = (item) => {
    return user && item?.owner?._id === user._id;
  };

  const renderSaveButton = (item) => {
    console.log("Itinerary is : ",item)

    // Don't show save button if user owns the itinerary
    if (isOwnerOfItinerary(item)) {
      return (
        <div className="mt-8 text-center">
          <div className="px-8 py-3 bg-gray-300 text-gray-600 text-lg font-semibold rounded-lg flex items-center justify-center mx-auto cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Your Itinerary
          </div>
        </div>
      );
    }
  

    // If user is not logged in
    if (!user) {
      return (
        <div className="mt-8 text-center">
          <button 
            className="px-8 py-3 bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition transform hover:-translate-y-1 flex items-center justify-center mx-auto"
            onClick={
              // () => toast.info("Please login to save itineraries")
              () => navigate('/login')
              
              }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Login to Save
          </button>
        </div>
      );
    }

    // If itinerary is already saved
    if (isItinerarySaved(item._id)) {
      return (
        <div className="mt-8 text-center">
          <div className="px-8 py-3 bg-green-100 text-green-700 text-lg font-semibold rounded-lg border-2 border-green-300 flex items-center justify-center mx-auto cursor-default">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Already Saved
          </div>
        </div>
      );
    }

    // Default save button for logged-in users with unsaved itineraries
    return (
      <div className="mt-8 text-center">
        <button 
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center mx-auto"
          onClick={() => cloneItinerary(item._id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save This Itinerary
        </button>
      </div>
    );

  }

    return (
    <section className="py-12 bg-gradient-to-b from-blue-100 via-sky-50 to-white min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
            {/* Enhanced Header with Light Bulb Icon */}
            <div className="text-center mb-12 relative">
                <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-4 drop-shadow-sm">Plan Your Dream Vacation</h1>
                <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">Discover amazing destinations, create personalized itineraries, and embark on unforgettable adventures.</p>
            </div>

            {/* Enhanced Search Section with Animation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-12 transform transition duration-300 hover:shadow-2xl border border-blue-50">
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="pl-12 w-full px-5 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-700 bg-blue-50/30"
                                placeholder="Where do you want to go? (e.g., Dubai, Jaipur)"
                                onChange={handleCityChange}
                                value={city}
                                list="search-history"
                            />
                            <datalist id="search-history">
                                {searchHistory.map((item, index) => (
                                    <option key={index} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <button 
                            className={`px-8 py-4 rounded-xl text-white font-medium transition-all shadow-md ${
                                loading 
                                ? "bg-blue-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-lg"
                            }`} 
                            onClick={() => { onSubmit(); fetchEvents(); }} 
                            disabled={eventLoading}
                        >
                            {eventLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Searching...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Explore
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div> 

            {/* City Details - Enhanced */}
            {isFinal && finalCity ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-12 border-t-4 border-blue-500 animate-fade-in transition-all">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="md:w-2/3">
                            <div className="flex flex-wrap items-center mb-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mr-3">{finalCity.name}</h2>
                                {weatherData && (
                                    <div className="mt-2 md:mt-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full px-4 py-1.5 flex items-center text-sm shadow-sm">
                                        {weatherData.condition === "Sunny" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        ) : weatherData.condition.includes("Rain") ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.546-7h.546a4 4 0 100-8H6.95a4.5 4.5 0 00-4.45 3.8M8 7v4m0 0l-2 2m2-2l2 2" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                            </svg>
                                        )}
                                        <span className="mr-1">{weatherData.condition}</span>
                                        <span className="font-medium">{weatherData.temp}°C</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="prose prose-lg max-w-none text-gray-600 mb-6 leading-relaxed">
                                <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-blue-800 first-letter:mr-1 first-letter:float-left">{finalCity.blog}</p>
                            </div>
                        </div>

                        <div className="md:w-1/3 rounded-2xl overflow-hidden shadow-lg group">
                            {finalCity.cityImage?.length > 0 ? (
                                <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl">
                                    <img 
                                        src={finalCity.cityImage[0]}
                                        alt={finalCity.name} 
                                        className="w-full h-full object-cover object-center transition-transform duration-10000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-6 left-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="text-white font-medium text-lg bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">Experience {finalCity.name}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 md:h-80 flex items-center justify-center bg-blue-50 rounded-2xl">
                                    <p className="text-gray-500">No images available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery Carousel - KEEPING AS IS */}
                    {finalCity.cityImage?.length > 1 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Gallery Experience</h3>
                            <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
                                {/* Main Image Container */}
                                <div className="relative h-96 md:h-[32rem] bg-black">
                                    {finalCity.cityImage.slice(0, 10).map((image, index) => (
                                        <div 
                                            key={index} 
                                            className={`absolute inset-0 transition-all duration-700 transform ${
                                                index === currentImageIndex 
                                                    ? 'opacity-100 scale-100 z-10' 
                                                    : index === (currentImageIndex - 1 + finalCity.cityImage.length) % finalCity.cityImage.length
                                                        ? 'opacity-0 -translate-x-full scale-105 z-0' 
                                                        : index === (currentImageIndex + 1) % finalCity.cityImage.length
                                                            ? 'opacity-0 translate-x-full scale-105 z-0'
                                                            : 'opacity-0 scale-110 z-0'
                                            }`}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${finalCity.name} - ${index + 1}`} 
                                                className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110 ease-out" 
                                            />
                                            {/* Caption overlay */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-6 px-6">
                                                <p className="text-white font-medium text-lg">{finalCity.name} - Scenic View {index + 1}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Navigation Arrows with improved styling */}
                                <button 
                                    onClick={() => {
                                        setCurrentImageIndex((prev) => prev === 0 ? finalCity.cityImage.length - 1 : prev - 1);
                                        setDirection('left');
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white hover:text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm focus:outline-none transform transition-all duration-300 hover:scale-110 z-20"
                                    aria-label="Previous image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        setCurrentImageIndex((prev) => (prev + 1) % finalCity.cityImage.length);
                                        setDirection('right');
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white hover:text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm focus:outline-none transform transition-all duration-300 hover:scale-110 z-20"
                                    aria-label="Next image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                                
                                {/* Enhanced indicator dots */}
                                <div className="absolute bottom-0 inset-x-0 flex justify-center mb-6 space-x-3 z-20">
                                    {finalCity.cityImage.slice(0, 10).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setDirection(index > currentImageIndex ? 'right' : 'left');
                                                setCurrentImageIndex(index);
                                            }}
                                            className={`w-3 h-3 rounded-full focus:outline-none transition-all duration-300 ${
                                                index === currentImageIndex 
                                                    ? 'bg-white w-8 shadow-glow' 
                                                    : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="container mx-auto px-4 py-12">
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
                        
                        {!eventLoading && submitted && events.length > 0 ? (
                        <div className="animate-fadeIn">
                            {/* Events Section */}
                            <div className="mb-12">
                            <div className="flex items-center justify-center mb-10">
                                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 mr-4"></div>
                                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Exciting Events</h2>
                                <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent w-24 ml-4"></div>
                            </div>
                
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {events.slice(0, 8).map((event, index) => (
                                <div 
                                    key={index}
                                    className="group cursor-pointer transition-all duration-300 hover:transform hover:scale-105"
                                    onMouseEnter={() => setAnimateCard(index)}
                                    onMouseLeave={() => setAnimateCard(-1)}
                                    onClick={() => handleViewDetails(event.link)}
                                >
                                    {/* Vertical rectangle image */}
                                    <div 
                                    className="h-72 rounded-lg overflow-hidden relative mb-3"
                                    style={{
                                        backgroundImage: `url(${event.image || '/api/placeholder/300/400'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                    >
                                    {/* Elegant shine effect on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    
                                    {/* New animation: Subtle pulse glow effect */}
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
                        ) : !eventLoading && submitted && events.length === 0 && (
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
                        )}
                    </div>

                    {/* Enhanced Plan Your Journey Section */}
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -mr-32 -mt-32 opacity-70"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -ml-16 -mb-16 opacity-70"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center mb-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <h2 className="text-2xl font-semibold text-gray-800">Plan Your Journey</h2>
                            </div>
                            
                            <form onSubmit={tourSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Your Budget (rupees )</label>
                                    <div className="relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-black text-lg">Rs.</span>
                                        </div>
                                        <input
                                            type="number"
                                            className="pl-10 block w-full rounded-xl border-gray-300 border-2 focus:ring-blue-500 focus:border-blue-500 py-3 bg-white/80 backdrop-blur-sm transition-all focus:bg-white"
                                            placeholder="e.g. 1000"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Length of Stay (Days)</label>
                                    <div className="relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500">days</span>
                                        </div>
                                        <input
                                            type="number"
                                            className="block w-full rounded-xl border-gray-300 border-2 focus:ring-blue-500 focus:border-blue-500 py-3 bg-white/80 backdrop-blur-sm transition-all focus:bg-white"
                                            placeholder="e.g. 5"
                                            value={days}
                                            onChange={(e) => setDays(e.target.value)}
                                            required
                                            min="1"
                                            max="30"
                                        />
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-xl transition transform hover:scale-[1.02] shadow-lg flex justify-center items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Generate Custom Itinerary
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Enhanced Tour Itinerary */}
                    {isTourSubmit && itinerary ? (
                      Array.isArray(itinerary) && itinerary.length > 0 ? (
                        <div id="itinerary-section" className="mt-12 max-w-7xl mx-auto">
                          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
                            Your Personalized Travel Experience
                          </h2>
                          
                          {/* Map Section - Shows at the top for all itineraries */}
                          <div 
                            ref={mapSectionRef}
                            className="bg-white rounded-2xl shadow-xl mb-10 overflow-hidden border border-blue-100 hover:shadow-2xl transition duration-300"
                          >
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                              <h3 className="text-2xl font-bold text-white">
                                {itinerary[activeItineraryIndex]?.city || "Destination"} Interactive Map
                              </h3>
                              <p className="text-blue-100 mt-1">
                                Explore your full {itinerary[activeItineraryIndex]?.totalDays || 0}-day journey with all attractions
                              </p>
                            </div>
                            
                            <div className="p-6">
                              {getValidPlaces().length > 0 ? (
                                <div className="h-96 w-full rounded-lg overflow-hidden shadow-inner border border-gray-200">
                                  <MapContainer 
                                    key={mapKey}
                                    center={getMapBounds() ? getMapBounds()[0] : [20.5937, 78.9629]} 
                                    zoom={12} 
                                    style={{ height: "100%", width: "100%" }}
                                    bounds={getMapBounds()}
                                    boundsOptions={{ padding: [50, 50] }}
                                    zoomControl={false}
                                  >
                                    <TileLayer 
                                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                                    />
                                    <ZoomControl position="bottomright" />
                                    
                                    {/* Show markers for all places with valid coordinates */}
                                    {getValidPlaces().map((place, index) => {
                                      const day = getDayForPlace(place.name);
                                      
                                      return (
                                        <Marker 
                                          key={`${place.name}-${index}`} 
                                          position={[place.latitude, place.longitude]} 
                                          icon={day ? createDayIcon(day) : customIcon}
                                        >
                                          <Popup>
                                            <div className="w-48">
                                              <h3 className="font-bold text-blue-700">{place.name}</h3>
                                              {day > 0 && (
                                                <div className="bg-blue-50 text-blue-800 inline-block px-2 py-1 rounded text-xs font-semibold mt-1">
                                                  Day {day}
                                                </div>
                                              )}
                                              {place.rating && (
                                                <div className="flex items-center mt-1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                  </svg>
                                                  <span className="ml-1 text-sm">{place.rating}</span>
                                                </div>
                                              )}
                                              {place.distance && (
                                                <div className="mt-1 text-sm text-gray-600">
                                                  <span>{place.distance} km from city center</span>
                                                </div>
                                              )}
                                              {place.description && (
                                                <div className="mt-2 text-sm text-gray-600 max-h-20 overflow-y-auto">
                                                  {place.description.length > 100 
                                                    ? `${place.description.substring(0, 100)}...` 
                                                    : place.description}
                                                </div>
                                              )}
                                            </div>
                                          </Popup>
                                        </Marker>
                                      );
                                    })}
                                    
                                    {/* Add a marker for the hotel if it exists */}
                                    {itinerary[activeItineraryIndex]?.selectedHotel && 
                                    itinerary[activeItineraryIndex].selectedHotel.latitude && 
                                    itinerary[activeItineraryIndex].selectedHotel.longitude && (
                                      <Marker 
                                        position={[
                                          itinerary[activeItineraryIndex].selectedHotel.latitude, 
                                          itinerary[activeItineraryIndex].selectedHotel.longitude
                                        ]} 
                                        icon={new L.DivIcon({
                                          className: "custom-div-icon",
                                          html: `<div style="background-color: #4F46E5; 
                                                color: white; 
                                                width: 30px; 
                                                height: 30px; 
                                                display: flex; 
                                                justify-content: center; 
                                                align-items: center; 
                                                border-radius: 50%; 
                                                font-weight: bold;
                                                box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                  </svg>
                                                </div>`,
                                          iconSize: [30, 30],
                                          iconAnchor: [15, 15],
                                          popupAnchor: [0, -15]
                                        })}
                                      >
                                        <Popup>
                                          <div className="w-48">
                                            <h3 className="font-bold text-indigo-700">{itinerary[activeItineraryIndex].selectedHotel.Name}</h3>
                                            <div className="bg-indigo-50 text-indigo-800 inline-block px-2 py-1 rounded text-xs font-semibold mt-1">
                                              Hotel
                                            </div>
                                            <div className="flex items-center mt-1">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                              </svg>
                                              <span className="ml-1 text-sm">{itinerary[activeItineraryIndex].selectedHotel.Rating}</span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-600">
                                              <span>₹{itinerary[activeItineraryIndex].selectedHotel.Price} per night</span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-600">
                                              <span>{itinerary[activeItineraryIndex].selectedHotel.Address}</span>
                                            </div>
                                          </div>
                                        </Popup>
                                      </Marker>
                                    )}
                                  </MapContainer>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 h-60">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                  <p className="text-gray-600 text-lg font-medium">No location data available for this itinerary</p>
                                  <p className="text-gray-500 text-sm mt-2">The selected attractions don't have geographical coordinates</p>
                                </div>
                              )}
                              
                              {/* Map Legend */}
                              {getValidPlaces().length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4 justify-center">
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">1</div>
                                    <span className="text-sm text-gray-700">Day 1</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mr-2">2</div>
                                    <span className="text-sm text-gray-700">Day 2</span>
                                  </div>
                                  {itinerary[activeItineraryIndex]?.totalDays > 2 && (
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold mr-2">3</div>
                                      <span className="text-sm text-gray-700">Day 3</span>
                                    </div>
                                  )}
                                  {itinerary[activeItineraryIndex]?.totalDays > 3 && (
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold mr-2">4</div>
                                      <span className="text-sm text-gray-700">Day 4</span>
                                    </div>
                                  )}
                                  {itinerary[activeItineraryIndex]?.selectedHotel && (
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                      </div>
                                      <span className="text-sm text-gray-700">Hotel</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Detailed Itinerary Cards */}
                          {itinerary.map((item, index) => (
                            <div
                              key={item?._id || index}
                              className={`bg-white rounded-2xl shadow-xl mb-10 overflow-hidden border border-blue-100 hover:shadow-2xl transition duration-300 ${activeItineraryIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                              onClick={() => {
                                setActiveItineraryIndex(index);
                              }}
                            >
                              {/* Header */}
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-2xl font-bold text-white">
                                    Discover {item?.city || "Your Destination"}
                                  </h3>
                                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                                    <span className="text-black font-medium">{item?.totalDays || 0} Days Journey</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap mt-2 gap-4 text-white">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h1a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H8a2 2 0 01-2-2v-6a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                    </svg>
                                    <span>Budget: ₹{item?.userBudget || 0}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{item?.totalDays || 0} Days</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {item?.owner?.username ? (
                                      <Link
                                        to={`/u/${item.owner.username}`}
                                        className="text-white hover:text-gray-200 hover:underline transition-colors duration-150"
                                      >
                                        <span>@{item.owner.username}</span>
                                      </Link>
                                    ) : (
                                      <span className="text-gray-300">Unknown User</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-6">
                                {/* Hotel Section */}
                                {item?.selectedHotel && (
                                  <div className="mb-8">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                      </svg>
                                      Your Accommodation
                                    </h4>
                                    
                                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                      <div className="flex flex-col md:flex-row md:justify-between">
                                        <div>
                                          <h5 className="text-lg font-bold text-blue-800">{item.selectedHotel.Name}</h5>
                                          <p className="text-gray-600 mt-1">{item.selectedHotel.Address}</p>
                                          
                                          <div className="flex items-center mt-2">
                                            <div className="flex">
                                              {Array.from({ length: 5 }).map((_, i) => (
                                                <svg 
                                                  key={i}
                                                  xmlns="http://www.w3.org/2000/svg" 
                                                  className={`h-5 w-5 ${i < Math.floor(item.selectedHotel.Rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                  viewBox="0 0 20 20" 
                                                  fill="currentColor"
                                                >
                                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                              ))}
                                              <span className="ml-1 text-blue-800 font-medium">{item.selectedHotel.Rating}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="mt-4 md:mt-0">
                                          <div className="flex items-center bg-white rounded-lg py-2 px-4 shadow">
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg> */}
                                            <span className="font-semibold text-gray-800">₹{item.selectedHotel.Price} per night</span>
                                          </div>
                                          
                                          {item.selectedHotel.URL && (
                                            <a 
                                              href={item.selectedHotel.URL.startsWith('http') ? item.selectedHotel.URL : `https://goibibo.com${item.selectedHotel.URL}`} 
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="mt-3 inline-flex items-center justify-center w-full text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                              View Details
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                              </svg>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Daily Plans Section */}
                                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  Your Day-by-Day Itinerary
                                </h4>
                                
                                <div className="space-y-6">
                                  {item?.dailyPlan?.map((day, dayIndex) => (
                                    <div key={day?._id || dayIndex} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                      <h5 className="text-lg font-bold text-blue-800 mb-3">Day {day?.day}: {day?.places?.length || 0} Attractions</h5>
                                      
                                      <div className="space-y-4">
                                        {day?.places?.map((placeName, placeIndex) => {
                                          const placeDetails = item.selectedPlaces?.find(p => p.name === placeName);
                                          
                                          return (
                                            <div key={placeIndex} className="bg-white rounded-lg p-4 shadow">
                                              <div className="flex justify-between items-start">
                                                <div className='flex gap-1 '>
                                                  <h6 className="text-md font-semibold text-gray-800">{placeName}</h6>
                                                  {placeDetails?.rating && (
                                                    <div className="flex items-center bg-yellow-50 px-2  rounded-md">
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                      </svg>
                                                      <span className="ml-1 text-yellow-700 font-medium">{placeDetails.rating}</span>
                                                    </div>
                                                  )}
                                                </div>
                                                <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                                                  placeDetails.budget === 0 || placeDetails.budget === '0'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                  {placeDetails.budget === 0 || placeDetails.budget === '0' 
                                                    ? 'Free' 
                                                    : `₹ ${Number(placeDetails.budget).toLocaleString('en-IN')}`}
                                                </div>
                                              </div>
                                              {placeDetails?.description && (
                                                <p className="text-gray-600 text-sm mt-2">
                                                  {placeDetails.description.length > 150 
                                                    ? `${placeDetails.description.substring(0, 150)}...` 
                                                    : placeDetails.description}
                                                </p>
                                              )}
                                              
                                              <div className="flex flex-wrap gap-2 mt-3">
                                                {placeDetails?.tags?.map((tag, tagIndex) => (
                                                  <span 
                                                    key={tagIndex}
                                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                  >
                                                    {tag}
                                                  </span>
                                                ))}
                                              </div>
                                              
                                              {placeDetails?.latitude && placeDetails?.longitude && (
                                                <button
                                                  onClick={scrollToMap}
                                                  className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                  </svg>
                                                  View on Map
                                                </button>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Dynamic Save Button */}
                                {renderSaveButton(item)}
                              </div>
                              
                              {/* Footer with Trip Budget Summary */}
                              <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-800">Trip Summary</h4>
                                    <p className="text-gray-600 mt-1">Estimated total: ₹{item?.totalBudget || 'N/A'}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Hotel: ₹{item?.selectedHotel ? item.selectedHotel.Price * item.totalDays : 'N/A'}
                                      </div>
                                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14" />
                                        </svg>
                                        Activities: ₹{item?.activitiesBudget || 'N/A'}
                                      </div>
                                      <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Food: ₹{item?.foodBudget || 'N/A'}
                                      </div>
                                      <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Transport: ₹{item?.transportBudget || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 flex space-x-2">
                                    <button 
                                      onClick={handlePrint}
                                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-300"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                      </svg>
                                      Print
                                    </button>
                                    <button 
                                      onClick={() => handleShareItinerary(item)}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex justify-center items-center transition duration-300"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                      </svg>
                                      Share
                                    </button>
                                    
                                    <Link 
                                      to={`/it/${item._id}`}
                                      target="_blank" 
                                      rel="noopener noreferrer"  
                                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
                                    >
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-12 max-w-3xl mx-auto text-center">
                          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Itinerary Data Found</h3>
                            <p className="text-gray-600 mb-4">There was an issue generating your travel itinerary. Please try again.</p>
                            <button 
                              onClick={resetTourForm}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300"
                            >
                              Return to Form
                            </button>
                          </div>
                        </div>
                      )
                    ) : isTourSubmit ? (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600 text-lg mt-8 max-w-2xl mx-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <p className="font-medium">No matching itineraries found for your selected city, budget, and days.</p>
                                                <p className="mt-2 text-base text-red-500">Try adjusting your search criteria or explore our suggested destinations.</p>
                                            </div>
                                        ) : null
                    }

                  {Array.isArray(itinerary) && itinerary.length > 0 ? (
                    <div className="py-10 px-6 max-w-6xl mx-auto">
                      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">Recommended Itineraries</h1>
                      <p className="text-center text-gray-600 mb-10">Relive and plan your dream getaways</p>

                      {recommendedItineraries.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-10 text-center shadow-sm">
                          <div className="text-gray-400 text-8xl mb-4">✈️</div>
                          <h3 className="text-xl font-medium text-gray-700 mb-2">No recommendedItineraries found</h3>
                          <p className="text-gray-500">Your saved travel plans will appear here once you create them.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {recommendedItineraries.map((itinerary) => (
                            <div
                              key={itinerary._id}
                              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform ${selectedId === itinerary._id ? 'scale-105' : 'hover:scale-102'}`}
                              onClick={() => handleCardClick(itinerary._id)}
                            >
                              <div
                                className="h-32 bg-cover bg-center"
                                style={{
                                  backgroundImage: itinerary.cityImage
                                    ? `url(${itinerary.cityImage})`
                                    : 'linear-gradient(to right, #60a5fa, #6366f1)'
                                }}
                              >
                                <div className="flex justify-between items-start p-4">
                                  <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" /> {itinerary.totalDays} Days
                                  </div>
                                  <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    ₹{itinerary.userBudget}
                                  </div>
                                </div>
                              </div>
                
                              <div className="p-5">
                                <div className="flex items-center mb-2">
                                  <MapPin className="text-blue-500 w-5 h-5 mr-2" />
                                  <h2 className="text-2xl font-bold text-gray-800">{itinerary.city}</h2>
                                </div>
                
                                <div className="flex items-center text-gray-600 mb-4">
                                  <Hotel className="w-4 h-4 mr-2" />
                                  <p className="text-sm">{itinerary.selectedHotel?.Name || 'No hotel selected'}</p>
                                </div>
                
                                <div className={`overflow-hidden transition-all duration-300 ${selectedId === itinerary._id ? 'max-h-96' : 'max-h-28'}`}>
                                  <div className="mb-3">
                                    <span className="text-sm font-semibold text-gray-700 inline-flex items-center">
                                      <Clock className="w-4 h-4 mr-1" /> Daily Plan
                                    </span>
                                    <ul className="mt-2 space-y-2">
                                      {itinerary.dailyPlan.map((day) => (
                                        <li key={day.day} className="bg-gray-50 rounded-lg p-2">
                                          <span className="font-semibold text-blue-600">Day {day.day}:</span>
                                          <p className="text-sm text-gray-600">{day.places.join(', ')}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                
                                <div className="mt-4 text-center">
                                  <button className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                                    {selectedId === itinerary._id ? 'Show Less' : 'Expand Details'}
                                  </button>
                                </div>
                              </div>
                
                              <div className="px-5 pb-4 pt-2 flex justify-between border-t border-gray-100">
                                <Link
                                  to={`/it/${itinerary._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
                                >
                                  View Details
                                </Link>
                
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      </div>
                      ): noVal 
                  }
                    {/* Traveler Experiences Section */}
                    <div className="mt-16 mb-12">
                        <div className="flex items-center mb-8">
                            <div className="h-px bg-gray-200 flex-grow"></div>
                            <h2 className="text-2xl font-semibold text-gray-800 px-6">Traveler Experiences</h2>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <span className="text-blue-600 font-semibold">JS</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">James Smith</h3>
                                        <p className="text-sm text-gray-500">Visited Dubai, June 2024</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"The itinerary was perfect for our family. We got to experience everything we wanted without feeling rushed. The budget recommendations were spot on too!"</p>
                                <div className="mt-4 flex text-yellow-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                        <span className="text-green-600 font-semibold">EJ</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Emily Johnson</h3>
                                        <p className="text-sm text-gray-500">Visited Paris, March 2024</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"I was worried about planning a solo trip, but this made it so easy. The day-by-day schedule helped me make the most of my time and see all the highlights."</p>
                                <div className="mt-4 flex text-yellow-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                        <span className="text-purple-600 font-semibold">MR</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Michael Rodriguez</h3>
                                        <p className="text-sm text-gray-500">Visited Tokyo, January 2024</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"The accommodation recommendations were fantastic! I loved how it matched our exact budget and still found incredible places to stay with great amenities."</p>
                                <div className="mt-4 flex text-yellow-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-8">
                        <button className="bg-white text-blue-600 border border-blue-600 py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors font-medium">View More Experiences</button>
                        </div>
                    </div>
                </div>
            ) : (                  
                    <div className="mt-16 mb-12">
                                <div className="flex items-center mb-8">
                                    <div className="h-px bg-gray-200 flex-grow"></div>
                                    <h2 className="text-2xl font-semibold text-gray-800 px-6">Traveler Experiences</h2>
                                    <div className="h-px bg-gray-200 flex-grow"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                <span className="text-blue-600 font-semibold">JS</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">James Smith</h3>
                                                <p className="text-sm text-gray-500">Visited Dubai, June 2024</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic">"The itinerary was perfect for our family. We got to experience everything we wanted without feeling rushed. The budget recommendations were spot on too!"</p>
                                        <div className="mt-4 flex text-yellow-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                                <span className="text-green-600 font-semibold">EJ</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Emily Johnson</h3>
                                                <p className="text-sm text-gray-500">Visited Paris, March 2024</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic">"I was worried about planning a solo trip, but this made it so easy. The day-by-day schedule helped me make the most of my time and see all the highlights."</p>
                                        <div className="mt-4 flex text-yellow-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                                <span className="text-purple-600 font-semibold">RP</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Robert Patel</h3>
                                                <p className="text-sm text-gray-500">Visited Tokyo, January 2024</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic">"The personalized suggestions really made our honeymoon special. We discovered places we would never have found on our own. Highly recommend!"</p>
                                        <div className="mt-4 flex text-yellow-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                    </div>
                )
            }

            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12">
                    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-white/10 fill-current">
                        <circle cx="100" cy="100" r="100" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12">
                    <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="text-white/10 fill-current">
                        <circle cx="75" cy="75" r="75" />
                    </svg>
                </div>
                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready for your next adventure?</h2>
                    <p className="text-blue-100 mb-8">Subscribe to our newsletter and get insider travel tips, exclusive deals, and inspiration for your next journey!</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            className="px-5 py-3 rounded-lg flex-grow bg-white/20 backdrop-blur-sm text-white placeholder-blue-100 border border-blue-300/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            placeholder="Your email address"
                        />
                        <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition shadow-lg transform hover:scale-105" onClick={ () =>navigate('contact')}>
                            Contact
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 text-center text-gray-500 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <nav className="flex flex-wrap justify-center mb-6">
                        <div className="px-5 py-2">
                            <a href="/about" className="text-base text-gray-500 hover:text-gray-900">About</a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="/explore" className="text-base text-gray-500 hover:text-gray-900">Blog</a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="/contact" className="text-base text-gray-500 hover:text-gray-900">Contact</a>
                        </div>
                    </nav>
                    <p className="text-gray-400 text-sm">&copy; 2025 TravelWizard. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </section>

    );
};
export default Tour