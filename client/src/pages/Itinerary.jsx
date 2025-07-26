import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "react-toastify";
import { useAuth } from '../store/auth';
import { MapPin, Calendar, DollarSign, Hotel, Clock } from 'lucide-react';


export const ItineraryViewer = () => {
  const { id } = useParams(); // Get itinerary ID from URL
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const mapSectionRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate()

  const [recommendedItineraries,setRecommendedItineraries] = useState([])

  const { user,API,F_API ,authorizationToken} = useAuth();

    //saved itineraries
    const [savedItineraries, setSavedItineraries] = useState([]);
    const [loadingSavedItineraries, setLoadingSavedItineraries] = useState(false);

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
      html: `<div style="background-color: ${colors[(day-1) % colors.length]}; 
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

  // Fetch specific itinerary by ID
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!id) {
        setError('No itinerary ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API}/api/itineraries/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setItinerary(data);
        console.log("Itinerary is  : ",data);
        setError(null);
      } catch (err) {
        console.error('Error fetching itinerary:', err);
        setError('Failed to load itinerary. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  // Reset map when itinerary changes
  useEffect(() => {
    if (itinerary) {
      setMapKey(prevKey => prevKey + 1);
    }
  }, [itinerary]);

  // Get all valid places with coordinates
  const getValidPlaces = () => {
    if (!itinerary?.selectedPlaces) return [];
    return itinerary.selectedPlaces.filter(place => place.latitude && place.longitude);
  };

  // Get map bounds based on places
  const getMapBounds = () => {
    const validPlaces = getValidPlaces();
    if (validPlaces.length === 0) return null;
    return validPlaces.map(place => [place.latitude, place.longitude]);
  };

  // Get day number for a place
  const getDayForPlace = (placeName) => {
    if (!itinerary?.dailyPlan) return 0;
    
    for (let i = 0; i < itinerary.dailyPlan.length; i++) {
      if (itinerary.dailyPlan[i].places && itinerary.dailyPlan[i].places.includes(placeName)) {
        return itinerary.dailyPlan[i].day;
      }
    }
    return 0;
  };

  // Scroll to map section
  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // const cloneItinerary = async (id) => {
  //     try {
  //       const response = await fetch(`${API}/api/itineraries/clone`, {
  //         method: "POST",
  //         headers: {
  //           'Content-Type': "application/json",
  //           "authorization": authorizationToken
  //         },
  //         body: JSON.stringify({ publicItineraryId: id })
  //       });
    
  //       const res_data = await response.json();
  //       console.log("Cloned Itinerary:", res_data);
    
  //       // ✅ FIXED HERE: use response.ok, not res_data.ok
  //       if (response.ok) {
  //         toast.success("Itinerary cloned successfully");
  //       } else {
  //         console.log("Response error");
  //         toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
  //       }
  //     } catch (error) {
  //       console.log("try error");
  //       toast.error(`Error: ${error.message}`);
  //     }
  //   };

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
      const response = await fetch(`${API}/api/itineraries/${itinerary?._id}/recommendations`);
      const res_data = await response.json();

      if (!response.ok) {
        console.log("Recommended itineraries response is not ok");
        return;
      }

      // Fetch city images for each recommended itinerary
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
      console.log("Recommended itineraries with images:", enrichedItineraries);

    } catch (error) {
      console.log("handleRecommendedItineraries error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (itinerary?._id) {
    handleRecommendedItineraries();
  }
}, [itinerary]);

  // Handle share functionality
  // const handleShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: `${itinerary.city} Travel Itinerary`,
  //         text: `Check out this amazing ${itinerary.totalDays}-day itinerary for ${itinerary.city}!`,
  //         url: window.location.href,
  //       });
  //     } catch (err) {
  //       console.log('Error sharing:', err);
  //     }
  //   } else {
  //     // Fallback: copy to clipboard
  //     navigator.clipboard.writeText(window.location.href);
  //     alert('Link copied to clipboard!');
  //   }
  // };


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
      // console.log("item is : ",item)
      return user && item?.owner === user._id;
    };
  
    const renderSaveButton = (item) => {
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
          <div className="mt-2 my-5 text-center">
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
          <div className="mt-2 my-5 text-center">
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
        <div className="mt-2 my-5 text-center">
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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Itinerary</h3>
            <p className="text-gray-600 text-center">Please wait while we fetch your travel details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Itinerary Not Found</h3>
            <p className="text-gray-600">The requested itinerary could not be found.</p>
          </div>
        </div>
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            Your {itinerary.city} Adventure
          </h1>
          <p className="text-xl text-gray-600">
            {itinerary.totalDays} Days • ₹{itinerary.userBudget} Budget
          </p>
        </div>

        {/* Map Section */}
        <div 
          ref={mapSectionRef}
          className="bg-white rounded-2xl shadow-xl mb-10 overflow-hidden border border-blue-100 hover:shadow-2xl transition duration-300"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <h3 className="text-2xl font-bold text-white">
              {itinerary.city} Interactive Map
            </h3>
            <p className="text-blue-100 mt-1">
              Explore your full {itinerary.totalDays}-day journey with all attractions
            </p>
          </div>
          
          <div className="p-6 relative z-0">
            {getValidPlaces().length > 0 ? (
              <div className="h-96 w-full rounded-lg overflow-hidden shadow-inner border border-gray-200 ">
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

                  {/* Hotel Marker */}
                  {itinerary.selectedHotel && 
                  itinerary.selectedHotel.Latitude && 
                  itinerary.selectedHotel.Longitude && (
                    <Marker 
                      position={[
                        itinerary.selectedHotel.Latitude, 
                        itinerary.selectedHotel.Longitude
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
                          <h3 className="font-bold text-indigo-700">{itinerary.selectedHotel.Name}</h3>
                          <div className="bg-indigo-50 text-indigo-800 inline-block px-2 py-1 rounded text-xs font-semibold mt-1">
                            Hotel
                          </div>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm">{itinerary.selectedHotel.Rating}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <span>₹{itinerary.selectedHotel.Price} per night</span>
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
                <p className="text-gray-600 text-lg font-medium">No location data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Itinerary Card */}
        <div className="bg-white rounded-2xl shadow-xl mb-10 overflow-hidden border border-blue-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                Discover {itinerary.city}
              </h3>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-black font-medium">{itinerary.totalDays} Days Journey</span>
              </div>
            </div>
            <div className="flex flex-wrap mt-2 gap-4 text-white">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Budget: ₹{itinerary.userBudget}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{itinerary.totalDays} Days</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Hotel Section */}
            {itinerary.selectedHotel && (
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
                      <h5 className="text-lg font-bold text-blue-800">{itinerary.selectedHotel.Name}</h5>
                      <p className="text-gray-600 mt-1">{itinerary.selectedHotel.Address}</p>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg 
                              key={i}
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 ${i < Math.floor(itinerary.selectedHotel.Rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-blue-800 font-medium">{itinerary.selectedHotel.Rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="flex items-center bg-white rounded-lg py-2 px-4 shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-gray-800">₹{itinerary.selectedHotel.Price} per night</span>
                      </div>
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
              {itinerary.dailyPlan?.map((day, dayIndex) => (
                <div key={day._id || dayIndex} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <h5 className="text-lg font-bold text-blue-800 mb-3">Day {day.day}: {day.places?.length || 0} Attractions</h5>
                  
                  <div className="space-y-4">
                    {day.places?.map((placeName, placeIndex) => {
                      const placeDetails = itinerary.selectedPlaces?.find(p => p.name === placeName);
                      
                      return (
                        <div key={placeIndex} className="bg-white rounded-lg p-4 shadow">
                          <div className="flex justify-between items-start">
                            <h6 className="text-md font-semibold text-gray-800">{placeName}</h6>
                            
                            {placeDetails?.rating && (
                              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1 text-yellow-700 font-medium">{placeDetails.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          {placeDetails?.description && (
                            <p className="text-gray-600 mt-2 text-sm">{placeDetails.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* Dynamic Save Button */}
            {renderSaveButton(itinerary)}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={scrollToMap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View on Map
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Itinerary
          </button>
          
          <button 
            onClick={() => handleShareItinerary(itinerary)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex justify-center items-center transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>


        {/* Recommended Itineraries */}

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

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Happy travels! 🌟 Enjoy your {itinerary.city} adventure!</p>
        </div>


      </div>
    
    
    
    
    </div>
    
  );
};