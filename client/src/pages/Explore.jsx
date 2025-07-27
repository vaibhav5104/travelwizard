import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, Hotel, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [city, setCity] = useState("");
  const {API,user} = useAuth()
  const navigate = useNavigate()

  const [randomItinerary, setRandomItinerary] = useState(null);
  const [recommendedItineraries, setRecommendedItineraries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const image1 = "https://images.unsplash.com/photo-1579689189009-874f5cac2db5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw0fHxNYW5hbGl8ZW58MHx8fHwxNzQzODU5NjYzfDA&ixlib=rb-4.0.3&q=85";
  const image2 = "https://images.unsplash.com/photo-1561361058-c24cecae35ca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw0fHxWYXJhbmFzaXxlbnwwfHx8fDE3NDM4NTk2Nzl8MA&ixlib=rb-4.0.3&q=85"
  const image3 = "https://images.unsplash.com/photo-1589738611537-4c1b6a28158a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzM0Mzd8MHwxfHNlYXJjaHw4fHxEZWhyYWR1bnxlbnwwfHx8fDE3NDM4NjA0Nzl8MA&ixlib=rb-4.0.3&q=85"
  const image4 = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw4fHxNdW1iYWl8ZW58MHx8fHwxNzQzODU5Njc5fDA&ixlib=rb-4.0.3&q=85"
  
  // Mock data for popular destinations
  const destinations = [
    { id: 1, name: "Manali", description: "Most popular hill stations in Himachal", image: image1 },
    { id: 2, name: "Varanasi", description: "The Big Apple", image: image2 },
    { id: 3, name: "Dehradun", description: "The Heart of Japan", image: image3 },
    { id: 4, name: "Mumbai", description: "A Beautiful Harbour City", image: image4 },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };


useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      if (user && user._id) {
        // Logged-in: Try to get personalized recommendations
        const res = await fetch(`${API}/api/itineraries/user/${user._id}/recommendations`);
        const data = await res.json();

        if (!res.ok) {
          toast.error("Failed to fetch user recommendations");
        }

        if (Array.isArray(data) && data.length > 0) {
          setRecommendedItineraries(await enrichItineraries(data));
          return; // ✅ Done — personalized recommendations
        }
      }

      // 🔁 If no user or user has no saved itineraries — fallback to random
      const allRes = await fetch(`${API}/api/itineraries`);
      const allItineraries = await allRes.json();

      if (!allRes.ok || !Array.isArray(allItineraries) || allItineraries.length === 0) {
        toast.error("No itineraries available for random recommendation.");
        return;
      }

      const random = allItineraries[Math.floor(Math.random() * allItineraries.length)];
      setRandomItinerary(random);

      const randomRes = await fetch(`${API}/api/itineraries/${random._id}/recommendations`);
      const randomRecs = await randomRes.json();

      if (Array.isArray(randomRecs) && randomRecs.length > 0) {
        setRecommendedItineraries(await enrichItineraries(randomRecs));
      } else {
        toast("No recommendations found for the selected itinerary.");
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  fetchRecommendations();
}, [user]);

const enrichItineraries = async (itineraries) => {
  return await Promise.all(itineraries.map(async (item) => {
    try {
      const cityRes = await fetch(`${API}/api/tour/city/${encodeURIComponent(item.city)}`);
      const cityData = await cityRes.json();

      return {
        ...item,
        cityImage: cityData.city?.cityImage?.[0] || null,
      };
    } catch {
      return { ...item, cityImage: null };
    }
  }));
};


  const handleCardClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8 max-w-2xl">Explore breathtaking destinations and create unforgettable memories.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Popular Destinations */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Popular Destinations</h2>
            {/* <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">View all →</a> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{destination.name}</h3>
                  <p className="text-gray-600 mb-3">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">4.8 ★★★★☆</span>
                    <Link
                    to={`/city/${destination.name}`}
                     className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm font-medium">Explore</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seasonal Recommendations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Seasonal Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ludGVyfGVufDB8fDB8fHww" 
                className="w-full h-64 object-cover" alt="Winter" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Winter Wonderland</h3>
                <p className="text-white mb-4">Best places to visit this winter: Ski resorts, Christmas markets.</p>
                <Link 
                to={`/explore/seasonal/winter`}
                rel="noopener noreferrer" 

                className="bg-white text-blue-700 py-2 px-4 rounded-full w-max font-medium hover:bg-blue-50 transition-colors">Discover</Link>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyfGVufDB8fDB8fHww" 
                className="w-full h-64 object-cover" alt="Summer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Summer Escapes</h3>
                <p className="text-white mb-4">Perfect destinations for the summer heat: Beaches, summer festivals.</p>
                <Link 
                to={`/explore/seasonal/summer`}
                rel="noopener noreferrer"
                className="bg-white text-blue-700 py-2 px-4 rounded-full w-max font-medium hover:bg-blue-50 transition-colors">Discover</Link>
              </div>
            </div>
          </div>
        </section>

{/* Explore Section */}
<section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore & Discover</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Places Card */}
        <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-yellow-200 before:via-yellow-300 before:to-yellow-200 before:-z-10 before:blur-md before:opacity-0 hover:before:opacity-80 before:transition-opacity before:duration-300">
          <div className="h-48 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsJTIwcGxhY2VzfGVufDB8fDB8fHww"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              alt="Places"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Explore Places</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover amazing destinations, hidden gems, and must-visit attractions around the world.
            </p>
            <Link
              to="/place"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Start Exploring
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Hotels Card */}
        <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-yellow-200 before:via-yellow-300 before:to-yellow-200 before:-z-10 before:blur-md before:opacity-0 hover:before:opacity-80 before:transition-opacity before:duration-300">
          <div className="h-48 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              alt="Hotels"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Find Hotels</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Book comfortable stays, luxury resorts, and budget-friendly accommodations worldwide.
            </p>
            <Link
              to="/hotel"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Find Hotels
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
        
        {/* Recommended Itineraries */}
        <div className="py-10 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">You May Also Like</h2>
          <p className="text-center text-gray-600 mb-8">Recommended based on a randomly selected itinerary</p>

          {recommendedItineraries.length === 0 ? (
            <div className="text-center text-gray-500">No recommendations found.</div>
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
                        : 'linear-gradient(to right, #60a5fa, #6366f1)',
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Reviews */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">User Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">JD</div>
                <div>
                  <h4 className="font-medium text-gray-900">Jane Doe</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">"Paris is magical! I fell in love with the city. The Eiffel Tower at night is an unforgettable experience that everyone should witness at least once."</p>
              <p className="text-sm text-gray-500">Visited: June 2024</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl mr-4">JS</div>
                <div>
                  <h4 className="font-medium text-gray-900">John Smith</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">"New York is always full of energy! A must-see destination. The city truly never sleeps and offers countless attractions for every type of traveler."</p>
              <p className="text-sm text-gray-500">Visited: September 2024</p>
            </div>
          </div>
        </section>

        {/* Travel Tips Section (Added Feature) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Travel Tips & Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4" >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Safety Guides</h3>
              <p className="text-gray-600 mb-4">Essential safety tips for travelers in different regions around the world.</p>
              <a href="https://www.worldpackers.com/articles/simple-travel-safety-tips" className="text-blue-600 hover:text-blue-800 font-medium">Read more →</a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Budget Planning</h3>
              <p className="text-gray-600 mb-4">How to plan your travel budget and save money while exploring new places.</p>
              <a href="https://www.ef.com/wwen/blog/language/how-to-travel-on-a-budget-9-best-tips/" className="text-blue-600 hover:text-blue-800 font-medium">Read more →</a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Language Tips</h3>
              <p className="text-gray-600 mb-4">Essential phrases and language resources for international travelers.</p>
              <a href="https://www.ef.com/wwen/blog/language/essential-english-phrases-travel/" className="text-blue-600 hover:text-blue-800 font-medium">Read more →</a>
            </div>
          </div>
        </section>

        {/* Newsletter Signup (Added Feature) */}
        <section className="mb-16 bg-blue-50 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Travel Inspiration</h2>
            <p className="text-gray-600 mb-6">Subscribe to our Travel suggestions website for exclusive deals, travel tips, and destination guides.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors" onClick={() => navigate('/contact')}>
                Contact
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Explore