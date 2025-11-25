import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Hotel, Clock } from 'lucide-react';
import { useAuth } from '../store/auth';
import { FaBuildingLock } from "react-icons/fa6";

const SavedItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const { API ,user} = useAuth();

  const [recommendedItineraries,setRecommendedItineraries] = useState([])

  const fetchItinerariesWithCityImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/itineraries/clone`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch itineraries');

      const data = await response.json();

      // Fetch city image for each itinerary
      const enrichedItineraries = await Promise.all(data.map(async (itinerary) => {
        try {
          const cityRes = await fetch(`${API}/api/tour/city/${encodeURIComponent(itinerary.city)}`);
          if (!cityRes.ok) throw new Error(`City fetch failed for ${itinerary.city}`);
          const cityData = await cityRes.json();
          return {
            ...itinerary,
            cityImage: cityData.city.cityImage[0] || null
          };
        } catch (err) {
          console.error(err);
          return { ...itinerary, cityImage: null };
        }
      }));

      setItineraries(enrichedItineraries);
      console.log("Saved Itineraries : ",data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerariesWithCityImages();
  }, []);

  const handleItineraryNavigation = (e, id) => {
    e.stopPropagation();
    navigate(`/it/${id}`);
  };

  const handleCardClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  useEffect(() => {
    const handleRecommendedItineraries = async () => {
      try {
        const response = await fetch(`${API}/api/itineraries/user/${user._id}/recommendations`);
        console.log("user id  :",user._id)
        const res_data = await response.json();

        if (!response.ok) {
          console.log("Recommended itineraries response is not ok");
          return;
        }

        if (!res_data.topItineraries || res_data.topItineraries.length === 0) {
          console.warn("No top itineraries returned by the API.");
          return;
        }


        const enrichedItineraries = await Promise.all(res_data.topItineraries.map(async (item) => {
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
  
    if (user?._id) {
      handleRecommendedItineraries();
    }
  }, [itineraries]);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your adventures...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="bg-gradient-to-b from-orange-200 to-blue-400">
      <div className="py-10 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">Your Travel Adventures</h1>
        <p className="text-center text-gray-600 mb-10">Relive and plan your dream getaways</p>

        {itineraries.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-10 text-center shadow-sm">
            <div className="text-gray-400 text-8xl mb-4">✈️</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No itineraries found</h3>
            <p className="text-gray-500">Your saved travel plans will appear here once you create them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {itineraries.map((itinerary) => (
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

        {/* Recommended Itineraries */}
        <div className="my-8 flex items-center justify-center">
          <div className="flex-grow border-t-2 border-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="mx-4 h-1 w-32 bg-gradient-to-r from-green-400 via-green-600 to-green-400 rounded-full shadow-lg shadow-green-500/50"></div>
          <div className="flex-grow border-t-2 border-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        </div>
        <div className="py-10 px-6 max-w-6xl mx-auto">
              <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 bg-">Recommended Itineraries</h1>
              <p className="text-center text-gray-600 mb-10">Relive and plan your dream getaways</p>
        
              {recommendedItineraries.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-10 text-center shadow-sm">
                  <div className="text-gray-400 flex text-8xl mb-4 justify-center items-center"><FaBuildingLock fill='orange'/></div>
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





      </div>
    </div>
  );
};
export default SavedItineraries