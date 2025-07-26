import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Calendar, Clock, Hotel, Star, Thermometer, Snowflake, Sun, CloudRain, Leaf, ArrowRight, Eye, EyeOff, Camera, Navigation, Users, DollarSign } from 'lucide-react';
import { useAuth } from "../store/auth";

const SingleCity = () => {
  const { cityName } = useParams(); // Get city name from URL parameter
  const [cityData, setCityData] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);
  const {API} = useAuth()

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  // Determine season based on city (you can modify this logic)
  const getSeason = (city) => {
    const summerCities = ["Varanasi", "Mumbai", "Amritsar", "Delhi", "Jaipur", "Goa"];
    const winterCities = ["Manali", "Dehradun", "Mussoorie", "Shimla", "Darjeeling", "Ooty"];
    
    if (summerCities.some(c => c.toLowerCase() === city.toLowerCase())) {
      return "summer";
    } else if (winterCities.some(c => c.toLowerCase() === city.toLowerCase())) {
      return "winter";
    }
    return "all-season"; // Default for cities not in specific seasonal lists
  };

  const season = getSeason(cityName);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch city data
        const cityRes = await fetch(`${API}/api/tour/city/${cityName}`);
        if (!cityRes.ok) {
          throw new Error(`City not found: ${cityName}`);
        }
        const cityJson = await cityRes.json();
        const cityInfo = cityJson.city;
        setCityData(cityInfo);

        // 2. Fetch itineraries for the city
        const itineraryRes = await fetch(`${API}/api/itineraries/city/${cityName}`);
        if (!itineraryRes.ok) {
          throw new Error(`No itineraries found for ${cityName}`);
        }
        const itineraryJson = await itineraryRes.json();

        // 3. Enrich itineraries with city image and shuffle
        const enrichedItineraries = shuffleArray(itineraryJson.itineraries || [])
          .map((itinerary) => ({
            ...itinerary,
            cityImage: cityInfo.cityImage?.[0] || null,
          }));

        setItineraries(enrichedItineraries);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  const handleCardClick = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const getSeasonIcon = () => {
    switch(season) {
      case "summer": return <Sun className="w-8 h-8" />;
      case "winter": return <Snowflake className="w-8 h-8" />;
      default: return <Leaf className="w-8 h-8" />;
    }
  };

  const getSeasonColors = () => {
    switch(season) {
      case "summer":
        return {
          primary: "from-orange-400 via-red-500 to-pink-500",
          secondary: "from-yellow-400 to-orange-500",
          accent: "border-orange-500",
          button: "bg-orange-500 hover:bg-orange-600",
          text: "text-orange-600"
        };
      case "winter":
        return {
          primary: "from-blue-400 via-cyan-500 to-teal-500", 
          secondary: "from-blue-400 to-cyan-500",
          accent: "border-cyan-500",
          button: "bg-cyan-500 hover:bg-cyan-600",
          text: "text-cyan-600"
        };
      default:
        return {
          primary: "from-green-400 via-emerald-500 to-teal-500",
          secondary: "from-green-400 to-emerald-500",
          accent: "border-emerald-500",
          button: "bg-emerald-500 hover:bg-emerald-600",
          text: "text-emerald-600"
        };
    }
  };

  const colors = getSeasonColors();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent bg-gradient-to-r ${colors.primary} mx-auto`}></div>
          <p className="text-xl font-semibold text-gray-700">Loading {cityName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">City Not Found</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className={`relative py-20 px-6 text-center bg-gradient-to-r ${colors.primary} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* City background image overlay */}
        {cityData.cityImage?.[0] && (
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${cityData.cityImage[0]})` }}
          ></div>
        )}
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
              {getSeasonIcon()}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              {cityData.name}
            </h1>
          </div>
          
          <div className="flex items-center justify-center mb-6 space-x-2">
            <div className="flex text-yellow-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <span className="text-xl font-medium ml-2">Premium Destination</span>
          </div>

          <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed mb-8">
            {cityData.blog?.split('.')[0] + '.' || `Discover the beautiful city of ${cityData.name} with its rich culture and breathtaking landscapes.`}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{itineraries.length} Itineraries Available</span>
            </div>
            <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium flex items-center space-x-2">
              <Navigation className="w-5 h-5" />
              <span>{season.charAt(0).toUpperCase() + season.slice(1)} Destination</span>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>

      <div className="py-16 px-6 max-w-7xl mx-auto">
        {/* City Details Section */}
        <div className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 ${colors.accent} hover:shadow-3xl transition-all duration-500 mb-16`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-start gap-12">
              <div className="lg:w-3/5 space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${colors.secondary} text-white shadow-lg`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Explore {cityData.name}
                    </h2>
                    <p className="text-lg text-gray-600 mt-2">A journey through culture and beauty</p>
                  </div>
                </div>

                <div className="prose prose-xl max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg first-letter:text-6xl first-letter:font-bold first-letter:text-transparent first-letter:bg-gradient-to-r first-letter:from-orange-500 first-letter:to-pink-500 first-letter:bg-clip-text first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                    {cityData.blog || `${cityData.name} is a magnificent destination that offers visitors an unforgettable experience with its unique blend of history, culture, and natural beauty. From ancient monuments to modern attractions, this city has something special for every traveler.`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <div className={`px-4 py-2 ${colors.button} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all`}>
                    🏔️ Adventure
                  </div>
                  <div className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all">
                    📸 Photography
                  </div>
                  <div className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all">
                    🍽️ Local Cuisine
                  </div>
                  <div className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all">
                    🏛️ Heritage
                  </div>
                </div>
              </div>

              <div className="lg:w-2/5 relative">
                {cityData.cityImage?.length > 0 ? (
                  <div className="relative group/img">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover/img:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={cityData.cityImage[0]}
                        alt={cityData.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-6 left-6 transform translate-y-4 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                          <span className="text-gray-800 font-bold text-lg flex items-center">
                            Discover More
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-80 lg:h-96 flex items-center justify-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Images coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Itineraries Section */}
        {itineraries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Travel Packages for {cityData.name}
                </h3>
                <p className="text-gray-600">Curated travel experiences</p>
              </div>
              <div className={`px-4 py-2 ${colors.button} text-white rounded-lg text-sm font-medium shadow-md flex items-center space-x-1`}>
                {/* <DollarSign className="w-4 h-4" /> */}
                <span>{itineraries.length} Packages</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {itineraries.map((itinerary, index) => (
                <div
                  key={itinerary._id}
                  className={`group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border ${
                    selectedId === itinerary._id ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCardClick(itinerary._id)}
                >
                  {/* Card Header Image */}
                  <div className="relative h-32 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: itinerary.cityImage
                          ? `url(${itinerary.cityImage})`
                          : `linear-gradient(135deg, ${colors.primary.split(' ').slice(1).join(' ')})`,
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300"></div>
                    
                    {/* Compact badges */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                      <div className="bg-white/90 px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-blue-600" />
                        <span className="text-gray-800">{itinerary.totalDays}Days</span>
                      </div>
                      <div className="bg-green-500/90 px-2 py-1 rounded text-xs text-white font-semibold">
                        ₹{(itinerary.userBudget / 1000).toFixed(0)}K
                      </div>
                    </div>

                    {/* Compact expand indicator */}
                    <div className="absolute bottom-2 right-2">
                      <div className={`p-1 rounded-md text-xs transition-all duration-300 ${
                        selectedId === itinerary._id 
                          ? 'bg-red-500/90 text-white' 
                          : 'bg-white/90 text-gray-700'
                      }`}>
                        {selectedId === itinerary._id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded bg-gradient-to-r ${colors.secondary}`}>
                        <MapPin className="text-white w-3 h-3" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 truncate">{itinerary.city}</h4>
                    </div>

                    <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2">
                      <Hotel className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {itinerary.selectedHotel?.Name || "Hotel TBD"}
                        </p>
                        <p className="text-xs text-gray-500">Included</p>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      selectedId === itinerary._id ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-1 text-gray-700 font-medium text-sm mb-2">
                          <Clock className="w-3 h-3" />
                          <span>Itinerary</span>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                          {itinerary.dailyPlan?.slice(0, 3).map((day) => (
                            <div key={day.day} className="bg-blue-50 rounded-md p-2 border-l-2 border-blue-400">
                              <div className="flex items-center space-x-1 mb-1">
                                <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {day.day}
                                </div>
                                <span className="text-xs font-medium text-blue-800">Day {day.day}</span>
                              </div>
                              <p className="text-gray-700 text-xs ml-6 leading-tight">
                                {day.places?.slice(0, 2).join(" → ") || "Activities planned"}
                                {day.places?.length > 2 && "..."}
                              </p>
                            </div>
                          )) || (
                            <div className="text-center text-gray-500 py-2">
                              <p className="text-xs">Details available on booking</p>
                            </div>
                          )}
                          {itinerary.dailyPlan && itinerary.dailyPlan.length > 3 && (
                            <div className="text-center text-xs text-gray-500 pt-1">
                              +{itinerary.dailyPlan.length - 3} more days
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Compact Action Button */}
                    <button className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                      selectedId === itinerary._id
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : `${colors.button} text-white hover:shadow-md`
                    }`}>
                      {selectedId === itinerary._id ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Less</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3  text-sm font-medium transition-all duration-200 flex items-center justify-center"
                    to={`/it/${itinerary._id}`}
                    >
                    Go to Itinerary
                    </Link>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* No itineraries message */}
        {itineraries.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Itineraries Available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on creating amazing travel packages for {cityData.name}. 
              Check back soon for exciting itineraries!
            </p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default SingleCity;