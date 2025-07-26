import React, { useEffect, useState } from "react";
import { Search, MapPin, Star, DollarSign, Navigation } from "lucide-react";
import { useAuth } from "../store/auth";

export const CityPlaces = () => {
  const [cityData, setCityData] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {API} = useAuth();

  const fetchCityByName = (name) => {
    if (!name.trim()) return;
    
    setLoading(true);
    setError("");
    
    fetch(`${API}/api/place/${name}`)
      .then(res => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
      })
      .then(data => {
        setCityData(data);
        setError("");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching city:", err);
        setCityData(null);
        setError("City not found");
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchCityByName(search);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm animate-fade-in">
            City Explorer
          </h1>
          <p className="text-xl text-gray-600 font-medium">Discover amazing places around the world</p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none rounded-xl focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 text-lg font-medium"
                    placeholder="Search by city name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transform transition-all duration-300 font-bold text-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => fetchCityByName(search)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Explore
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* City Data */}
        {cityData && (
          <div className="animate-fade-in">
            {/* City Header */}
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {cityData.city}
              </h2>
              <p className="text-gray-600 text-lg">
                {cityData.places.length} amazing places to explore
              </p>
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {cityData.places.map((place, i) => (
                <div 
                  key={i} 
                  className="group relative animate-fade-in"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105"></div>
                  
                  {/* Main Card */}
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 hover:border-white/40 overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-700 font-bold text-sm">{place.rating}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full">
                        <Navigation className="w-3 h-3 text-green-600" />
                        <span className="text-green-700 font-medium text-sm">{place.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full">
                        {/* <DollarSign className="w-3 h-3 text-blue-600" /> */}
                        <span className="text-blue-700 font-medium text-sm">₹{place.budget}</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {place.description}
                    </p>
                    
                    {/* Location */}
                    {(place.latitude && place.longitude) && (
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 text-sm font-medium">
                          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!cityData && !error && !loading && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Ready to explore?</h3>
            <p className="text-gray-500 text-lg">Enter a city name to discover amazing places around the world</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};