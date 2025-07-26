// import React, { useState, useEffect } from 'react';

// const SeasonalCities = () => {
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentSeason, setCurrentSeason] = useState('summer');

//   // Define seasonal city arrays
//   const seasonalCities = {
//     summer: ['varanasi', 'mumbai', 'Amritsar'],
//     winter: ['Manali', 'Dehradun', 'Massouri']
//   };

//   // Mock API base URL - replace with your actual API URL
//   const API = 'http://localhost:3000'; // Replace with your actual API base URL

//   // Mock weather data for demonstration
//   const mockWeatherData = {
//     varanasi: { condition: 'Sunny', temp: 35 },
//     mumbai: { condition: 'Partly Cloudy', temp: 32 },
//     Amritsar: { condition: 'Sunny', temp: 38 },
//     Manali: { condition: 'Light Rain', temp: 15 },
//     Dehradun: { condition: 'Cloudy', temp: 22 },
//     Massouri: { condition: 'Sunny', temp: 18 }
//   };

//   // Mock city data - replace with actual API calls
//   const mockCityData = {
//     varanasi: {
//       name: 'Varanasi',
//       blog: 'Varanasi, one of the oldest continuously inhabited cities in the world, is a spiritual capital of India. Located on the banks of the sacred Ganges River, this ancient city offers a mesmerizing blend of spirituality, culture, and history. The ghats come alive with evening aarti ceremonies, creating an unforgettable atmosphere of devotion and tradition.',
//       cityImage: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop']
//     },
//     mumbai: {
//       name: 'Mumbai',
//       blog: 'Mumbai, the city of dreams, is India\'s financial capital and the heart of Bollywood. This bustling metropolis offers a perfect blend of colonial architecture, modern skyscrapers, and vibrant street life. From the iconic Gateway of India to the bustling markets of Colaba, Mumbai never sleeps and always inspires.',
//       cityImage: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop']
//     },
//     Amritsar: {
//       name: 'Amritsar',
//       blog: 'Amritsar, home to the magnificent Golden Temple, is the spiritual center of Sikhism. This historic city in Punjab offers visitors a chance to experience profound spirituality, rich history, and incredible hospitality. The langar (community kitchen) at the Golden Temple serves thousands of visitors daily, embodying the Sikh principles of equality and service.',
//       cityImage: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop']
//     },
//     Manali: {
//       name: 'Manali',
//       blog: 'Manali, nestled in the Himalayas, is a popular hill station known for its stunning landscapes, adventure sports, and pleasant climate. Surrounded by snow-capped peaks, lush valleys, and gushing rivers, Manali offers the perfect escape from the heat. Whether you\'re seeking adventure or tranquility, this mountain paradise has something for everyone.',
//       cityImage: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop']
//     },
//     Dehradun: {
//       name: 'Dehradun',
//       blog: 'Dehradun, the capital of Uttarakhand, is beautifully situated in the Doon Valley between the Himalayas and the Shivaliks. Known for its pleasant climate, excellent educational institutions, and proximity to popular hill stations, Dehradun offers a perfect blend of urban amenities and natural beauty. The city serves as a gateway to many Himalayan destinations.',
//       cityImage: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop']
//     },
//     Massouri: {
//       name: 'Massouri',
//       blog: 'Massouri, a hidden gem in the mountains, offers breathtaking views and serene landscapes. This picturesque destination is perfect for those seeking peace and natural beauty away from crowded tourist spots. With its pristine environment and stunning vistas, Massouri provides an ideal winter retreat for nature lovers and adventure enthusiasts.',
//       cityImage: ['https://images.unsplash.com/photo-1464822759844-d150baec04de?w=800&h=600&fit=crop']
//     }
//   };

//   // Function to determine season from URL
//   const getSeasonFromURL = () => {
//     const path = window.location.pathname;
//     if (path.includes('/explore/winter')) {
//       return 'winter';
//     } else if (path.includes('/explore/summer')) {
//       return 'summer';
//     }
//     return 'summer'; // default
//   };

//   // Function to fetch city data
//   const fetchCityData = async (cityName) => {
//     try {
//       // In a real application, uncomment the line below and remove the mock data
//       // const response = await fetch(`${API}/api/tour/city/${cityName}`);
//       // const data = await response.json();
      
//       // For demonstration, using mock data
//       await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
//       return mockCityData[cityName] || { name: cityName, blog: 'City information not available.', cityImage: [] };
//     } catch (error) {
//       console.error(`Error fetching data for ${cityName}:`, error);
//       return { name: cityName, blog: 'Error loading city information.', cityImage: [] };
//     }
//   };

//   // Load cities based on current season
//   useEffect(() => {
//     const season = getSeasonFromURL();
//     setCurrentSeason(season);
    
//     const loadCities = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const cityNames = seasonalCities[season];
//         const cityDataPromises = cityNames.map(cityName => fetchCityData(cityName));
//         const citiesData = await Promise.all(cityDataPromises);
//         setCities(citiesData);
//       } catch (err) {
//         setError('Failed to load cities data');
//         console.error('Error loading cities:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCities();
//   }, []);

//   // Function to toggle season for demo purposes
//   const toggleSeason = () => {
//     const newSeason = currentSeason === 'summer' ? 'winter' : 'summer';
//     setCurrentSeason(newSeason);
    
//     const loadCities = async () => {
//       setLoading(true);
//       try {
//         const cityNames = seasonalCities[newSeason];
//         const cityDataPromises = cityNames.map(cityName => fetchCityData(cityName));
//         const citiesData = await Promise.all(cityDataPromises);
//         setCities(citiesData);
//       } catch (err) {
//         setError('Failed to load cities data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCities();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading {currentSeason} destinations...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center text-red-600">
//           <p className="text-xl mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-gray-800 mb-4 capitalize">
//             {currentSeason} Destinations
//           </h1>
//           <p className="text-xl text-gray-600 mb-6">
//             Discover the perfect {currentSeason} getaways
//           </p>
          
//           {/* Demo Toggle Button */}
//           <button
//             onClick={toggleSeason}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
//           >
//             Switch to {currentSeason === 'summer' ? 'Winter' : 'Summer'} Destinations
//           </button>
//         </div>

//         {/* Cities Grid */}
//         <div className="space-y-12">
//           {cities.map((finalCity, index) => {
//             const weatherData = mockWeatherData[finalCity.name.toLowerCase()] || mockWeatherData[finalCity.name];
            
//             return (
//               <div 
//                 key={index}
//                 className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-12 border-t-4 border-blue-500 animate-fade-in transition-all hover:shadow-2xl"
//               >
//                 <div className="flex flex-col md:flex-row items-start gap-8">
//                   <div className="md:w-2/3">
//                     <div className="flex flex-wrap items-center mb-6">
//                       <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mr-3">{finalCity.name}</h2>
//                       {weatherData && (
//                         <div className="mt-2 md:mt-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full px-4 py-1.5 flex items-center text-sm shadow-sm">
//                           {weatherData.condition === "Sunny" ? (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//                             </svg>
//                           ) : weatherData.condition.includes("Rain") ? (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-4.546-7h.546a4 4 0 100-8H6.95a4.5 4.5 0 00-4.45 3.8M8 7v4m0 0l-2 2m2-2l2 2" />
//                             </svg>
//                           ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
//                             </svg>
//                           )}
//                           <span className="mr-1">{weatherData.condition}</span>
//                           <span className="font-medium">{weatherData.temp}°C</span>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="prose prose-lg max-w-none text-gray-600 mb-6 leading-relaxed">
//                       <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-blue-800 first-letter:mr-1 first-letter:float-left">{finalCity.blog}</p>
//                     </div>
//                   </div>

//                   <div className="md:w-1/3 rounded-2xl overflow-hidden shadow-lg group">
//                     {finalCity.cityImage?.length > 0 ? (
//                       <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl">
//                         <img 
//                           src={finalCity.cityImage[0]}
//                           alt={finalCity.name} 
//                           className="w-full h-full object-cover object-center transition-transform duration-10000 group-hover:scale-110"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                         <div className="absolute bottom-6 left-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
//                           <span className="text-white font-medium text-lg bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">Experience {finalCity.name}</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="h-64 md:h-80 flex items-center justify-center bg-blue-50 rounded-2xl">
//                         <p className="text-gray-500">No images available</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeasonalCities;


import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Calendar, Clock, Hotel, Star, Thermometer, Snowflake, Sun, CloudRain, Leaf, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "../store/auth";

const summerCities = ["Varanasi", "Mumbai", "Amritsar"];
const winterCities = ["Manali", "Dehradun", "Mussoorie"];

const SeasonalCities = () => {
  const { season } = useParams(); // 'summer' or 'winter'
  const [citiesData, setCitiesData] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [seasonalCity, setSeasonalCity] = useState(""); 
  const {API} = useAuth()

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
    const cityList = season === "summer" ? summerCities : winterCities;

    const fetchData = async () => {
      try {
        const cityDataArray = [];
        const allItineraries = [];

        for (const city of cityList) {
          // 1. Fetch city data
          const cityRes = await fetch(`${API}/api/tour/city/${city}`);
          const cityJson = await cityRes.json();
          const cityData = cityJson.city;
          cityDataArray.push(cityData);

          // 2. Fetch itineraries for that city
          const itineraryRes = await fetch(`${API}/api/itineraries/city/${city}`);
          const itineraryJson = await itineraryRes.json();

          // 3. Enrich each itinerary with the city's first image
          const enrichedItineraries = shuffleArray(itineraryJson.itineraries || [])
            .slice(0, 3)
            .map((itinerary) => ({
              ...itinerary,
              cityImage: cityData.cityImage?.[0] || null,
            }));

          allItineraries.push(...enrichedItineraries);
        }

        setCitiesData(cityDataArray);
        setItineraries(allItineraries);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [season]);

  const handleCardClick = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const filteredItineraries = itineraries.filter((it) =>
    (season === "summer" ? summerCities : winterCities).includes(it.city)
  );

  const getSeasonIcon = () => {
    return season === "summer" ? <Sun className="w-8 h-8" /> : <Snowflake className="w-8 h-8" />;
  };

  const getSeasonColors = () => {
    return season === "summer" 
      ? {
          primary: "from-orange-400 via-red-500 to-pink-500",
          secondary: "from-yellow-400 to-orange-500",
          accent: "border-orange-500",
          button: "bg-orange-500 hover:bg-orange-600",
          text: "text-orange-600"
        }
      : {
          primary: "from-blue-400 via-cyan-500 to-teal-500", 
          secondary: "from-blue-400 to-cyan-500",
          accent: "border-cyan-500",
          button: "bg-cyan-500 hover:bg-cyan-600",
          text: "text-cyan-600"
        };
  };

  const colors = getSeasonColors();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent bg-gradient-to-r ${colors.primary} mx-auto`}></div>
          <p className="text-xl font-semibold text-gray-700">Discovering amazing {season} destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className={`relative py-20 px-6 text-center bg-gradient-to-r ${colors.primary} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
              {getSeasonIcon()}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              {season.charAt(0).toUpperCase() + season.slice(1)} Escapes
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
            Discover breathtaking {season} destinations that will create memories to last a lifetime
          </p>
          <div className="mt-8 flex justify-center">
            <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium">
              🌟 {citiesData.length} Premium Destinations Available
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>

      <div className="py-16 px-6 max-w-7xl mx-auto">
        {citiesData.map((finalCity, cityIndex) => (
          <div key={finalCity.name} className="mb-20">
            {/* Enhanced City Card */}
            <div className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 ${colors.accent} hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2`}>
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
                          {finalCity.name}
                        </h2>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">Premium Destination</span>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-xl max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg first-letter:text-6xl first-letter:font-bold first-letter:text-transparent first-letter:bg-gradient-to-r first-letter:from-orange-500 first-letter:to-pink-500 first-letter:bg-clip-text first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                        {finalCity.blog}
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
                    </div>
                  </div>

                  <div className="lg:w-2/5 relative">
                    {finalCity.cityImage?.length > 0 ? (
                      <div className="relative group/img">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover/img:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl">
                          <img
                            src={finalCity.cityImage[0]}
                            alt={finalCity.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-6 left-6 transform translate-y-4 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-300">
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                              <span className="text-gray-800 font-bold text-lg flex items-center">
                                Explore {finalCity.name}
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

            {/* Enhanced Itinerary Cards Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Curated Itineraries for {finalCity.name}
                  </h3>
                  <p className="text-gray-600 text-lg">Choose from our handpicked travel experiences</p>
                </div>
                <div className={`px-6 py-3 ${colors.button} text-white rounded-full font-medium shadow-lg`}>
                  {filteredItineraries.filter((it) => it.city === finalCity.name).length} Available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredItineraries
                  .filter((it) => it.city === finalCity.name)
                  .map((itinerary, index) => (
                    <div
                      key={itinerary._id}
                      className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer ${
                        selectedId === itinerary._id ? "ring-4 ring-blue-400 scale-105" : ""
                      }`}
                      onClick={() => handleCardClick(itinerary._id)}
                    >
                      {/* Card Header Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: itinerary.cityImage
                              ? `url(${itinerary.cityImage})`
                              : `linear-gradient(135deg, ${season === 'summer' ? '#ff6b6b, #ffa500' : '#4facfe, #00f2fe'})`,
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                        
                        {/* Floating badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-gray-800">{itinerary.totalDays} Days</span>
                          </div>
                          <div className="bg-green-500/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg text-white font-bold">
                            ₹{itinerary.userBudget}
                          </div>
                        </div>

                        {/* Expand/Collapse indicator */}
                        <div className="absolute bottom-4 right-4">
                          <div className={`p-2 rounded-full transition-all duration-300 ${
                            selectedId === itinerary._id 
                              ? 'bg-red-500/90 text-white' 
                              : 'bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white'
                          }`}>
                            {selectedId === itinerary._id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${colors.secondary}`}>
                            <MapPin className="text-white w-5 h-5" />
                          </div>
                          <h4 className="text-2xl font-bold text-gray-800">{itinerary.city}</h4>
                        </div>

                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-xl p-3">
                          <Hotel className="w-5 h-5 mr-3 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {itinerary.selectedHotel?.Name || "Hotel not selected"}
                            </p>
                            <p className="text-sm text-gray-500">Accommodation included</p>
                          </div>
                        </div>

                        {/* Expandable Content */}
                        <div className={`overflow-hidden transition-all duration-500 ${
                          selectedId === itinerary._id ? "max-h-96 opacity-100" : "max-h-20 opacity-70"
                        }`}>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
                              <Clock className="w-4 h-4" />
                              <span>Daily Itinerary</span>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                              {itinerary.dailyPlan.map((day) => (
                                <div key={day.day} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-400">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                      {day.day}
                                    </div>
                                    <span className="font-semibold text-blue-800">Day {day.day}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm ml-10 leading-relaxed">
                                    {day.places.join(" → ")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-gray-100">
                          <button className={`w-full py-3 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                            selectedId === itinerary._id
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : `${colors.button} text-white hover:shadow-lg transform hover:scale-105`
                          }`}>
                            {selectedId === itinerary._id ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span>Show Less</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
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

export default SeasonalCities;