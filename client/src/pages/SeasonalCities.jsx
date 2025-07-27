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