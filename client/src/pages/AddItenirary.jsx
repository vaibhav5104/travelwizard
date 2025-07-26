// import React from 'react'
// import { useState } from "react";
// import "../index.css";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";
// import { Navigate } from "react-router-dom";

// export const AddItinerary = () => {
// const { user, isLoading,isAuthenticated, API, authorizationToken } = useAuth();
  
  

//   const defaultItinerary = {
//     name: "",
//     budget: "",
//     days: "",
//   };

//   const [places, setPlaces] = useState([
//     { placeName: "", placeImage: null, placePrice: "", placeLink: "" },
//   ]);
//   const [hotels, setHotels] = useState([
//     { hotelName: "", hotelImage: null, hotelPrice: "", hotelLink: "" },
//   ]);
//   const [transportations, setTransportations] = useState([
//     { transportationName: "", transportationImage: null, transportationPrice: "", transportationLink: "" },
//   ]);

//   const [itinerary, setItinerary] = useState(defaultItinerary);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <h1 className="text-2xl font-bold text-blue-800">Loading...</h1>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated || !user?.isAdmin) {
//     return <Navigate to="/" />;
//   }  

//   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
//   const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

//   // Validate image files
//   const validateImages = (files) => {
//     for (const file of files) {
//       if (!VALID_FILE_TYPES.includes(file.type)) {
//         toast.error(`${file.name} is not a valid image file.`);
//         return false;
//       }
//       if (file.size > MAX_FILE_SIZE) {
//         toast.error(`${file.name} exceeds the maximum file size of 5MB.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   //change functions
//   const handlePlaceChange = (index, field, value) => {
//     const updatedPlaces = [...places];
//     updatedPlaces[index][field] = value;
//     setPlaces(updatedPlaces)
//   }
//   const handleHotelChange = (index, field, value) => {
//     const updatedHotels = [...hotels];
//     updatedHotels[index][field] = value;
//     setHotels(updatedHotels)
//   }
//   const handleTransportationChange = (index, field, value) => {
//     const updatedTransportations = [...transportations];
//     updatedTransportations[index][field] = value;
//     setTransportations(updatedTransportations)
//   }

//   // handleImageChange functions
//   const handlePlaceImageChange = (index, file) => {
//     if (!VALID_FILE_TYPES.includes(file.type)) {
//       toast.error(`Invalid file type: ${file.name}`)
//       return;
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       toast.error(`File size exceeds 5MB: ${file.name}`);
//       return;
//     }
//     const updatedPlaces = [...places]
//     updatedPlaces[index].placeImage = file
//     setPlaces(updatedPlaces)
//   }
//   const handleHotelImageChange = (index, file) => {
//     if (!VALID_FILE_TYPES.includes(file.type)) {
//       toast.error(`Invalid file type: ${file.name}`)
//       return;
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       toast.error(`File size exceeds 5MB: ${file.name}`);
//       return;
//     }
//     const updatedHotels = [...hotels]
//     updatedHotels[index].hotelImage = file
//     setHotels(updatedHotels)
//   }
//   const handleTransportationImageChange = (index, file) => {
//     if (!VALID_FILE_TYPES.includes(file.type)) {
//       toast.error(`Invalid file type: ${file.name}`)
//       return;
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       toast.error(`File size exceeds 5MB: ${file.name}`);
//       return;
//     }
//     const updatedTransportations = [...transportations]
//     updatedTransportations[index].transportationImage = file
//     setTransportations(updatedTransportations)
//   }

//   //Add functions
//   const handleAddPlace = () => {
//     setPlaces([...places, { placeName: "", placeImage: null, placePrice: "", placeLink: "" }])
//   }
//   const handleAddHotel = () => {
//     setHotels([...hotels, { hotelName: "", hotelImage: null, hotelPrice: "", hotelLink: "" }])
//   }
//   const handleAddTransportation = () => {
//     setTransportations([...transportations, { transportationName: "", transportationImage: null, transportationPrice: "", transportationLink: "" }])
//   }

//   // remove functions
//   const handleRemovePlace = (index) => {
//     const updatedPlaces = places.filter((_, i) => i !== index)
//     setPlaces(updatedPlaces)
//   }

//   const handleRemoveHotel = (index) => {
//     const updatedHotels = hotels.filter((_, i) => i !== index)
//     setHotels(updatedHotels)
//   }

//   const handleRemoveTransportation = (index) => {
//     const updatedTransportations = transportations.filter((_, i) => i !== index)
//     setTransportations(updatedTransportations)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate fields
//     if (!itinerary.name || !itinerary.budget || !itinerary.days) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }
//     if (places.length === 0) {
//       toast.error("Please add at least one place.");
//       return;
//     }
//     if (hotels.length === 0) {
//       toast.error("Please add at least one hotel.");
//       return;
//     }
//     if (transportations.length === 0) {
//       toast.error("Please add at least one transportation option.");
//       return;
//     }

//     const formData = new FormData();
//     const lowerCase = itinerary.name?.toLowerCase() || "";
//     formData.append("name", lowerCase);
//     formData.append("budget", itinerary.budget);
//     formData.append("days", itinerary.days);

//     // Modified logic for places, hotels, and transportations to handle potential array-like structure
//     places.forEach((place, index) => {
//       formData.append(`placeName[${index}]`, place.placeName);
//       formData.append(`placePrice[${index}]`, place.placePrice);
//       formData.append(`placeLink[${index}]`, place.placeLink);
//       if (place.placeImage) {
//         formData.append(`placeImages`, place.placeImage)
//       }
//     });

//     hotels.forEach((hotel, index) => {
//       formData.append(`hotelName[${index}]`, hotel.hotelName);
//       formData.append(`hotelPrice[${index}]`, hotel.hotelPrice);
//       formData.append(`hotelLink[${index}]`, hotel.hotelLink);
//       if (hotel.hotelImage) {
//         formData.append(`hotelImages`, hotel.hotelImage)
//       }
//     });

//     transportations.forEach((transport, index) => {
//       formData.append(`transportationName[${index}]`, transport.transportationName);
//       formData.append(`transportationPrice[${index}]`, transport.transportationPrice);
//       formData.append(`transportationLink[${index}]`, transport.transportationLink);
//       if (transport.transportationImage) {
//         formData.append(`transportationImages`, transport.transportationImage)
//       }
//     });

//     try {
//       const response = await fetch(`${API}/api/admin/city/${itinerary.name}/budget`, {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: authorizationToken,
//         },
//       });

//       if (response.ok) {
//         // setItinerary(defaultItinerary)
//         toast.success("Itinerary added successfully")
//       } else {
//         const error = await response.text();
//         console.error("Server Error:", error);
//         toast.error(`Itinerary already exists`)
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred while submitting the itinerary");
//     }
//   };


//   return (
//     <section className="min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900 py-12">
//       <main className="container mx-auto px-4">
//         <div className="max-w-5xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//             <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
//               <h1 className="text-3xl font-bold text-white">Travel Itinerary Creator</h1>
//               <div className="bg-white p-2 rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//                 </svg>
//               </div>
//             </div>
            
//             <div className="p-6 md:p-8 bg-gray-50">
//               <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
//                 <p className="text-blue-700">Create a new travel itinerary by filling out the details below. All fields marked with * are required.</p>
//               </div>
              
//               <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
//                 <div className="grid md:grid-cols-3 gap-6">
//                   <div className="space-y-2">
//                     <label htmlFor="cityName" className="block text-gray-700 font-medium">City Name *</label>
//                     <input
//                       type="text"
//                       id="cityName"
//                       placeholder="e.g., Paris"
//                       required
//                       value={itinerary.name}
//                       onChange={(e) => setItinerary({ ...itinerary, name: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="budget" className="block text-gray-700 font-medium">Budget ($) *</label>
//                     <input
//                       type="number"
//                       id="budget"
//                       placeholder="e.g., 1500"
//                       required
//                       value={itinerary.budget}
//                       onChange={(e) => setItinerary({ ...itinerary, budget: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="days" className="block text-gray-700 font-medium">Days *</label>
//                     <input
//                       type="number"
//                       id="days"
//                       placeholder="e.g., 7"
//                       required
//                       value={itinerary.days}
//                       onChange={(e) => setItinerary({ ...itinerary, days: e.target.value })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                     />
//                   </div>
//                 </div>

//                 {/* PLACES SECTION */}
//                 <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//                   <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
//                     <h3 className="text-xl font-bold text-white flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       Places to Visit
//                     </h3>
//                   </div>
//                   <div className="p-6">
//                     {places.map((place, index) => (
//                       <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 last:mb-0">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-lg font-semibold text-gray-800">Place #{index + 1}</h4>
//                           <button 
//                             type="button" 
//                             onClick={() => handleRemovePlace(index)}
//                             className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Remove
//                           </button>
//                         </div>
//                         <div className="grid md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Place Name *</label>
//                             <input
//                               type="text"
//                               value={place.placeName || ""}
//                               onChange={(e) => handlePlaceChange(index, "placeName", e.target.value)}
//                               required
//                               placeholder="e.g., Eiffel Tower"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Place Price ($)</label>
//                             <input
//                               type="number"
//                               value={place.placePrice || ""}
//                               onChange={(e) => handlePlaceChange(index, "placePrice", e.target.value)}
//                               placeholder="e.g., 25"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Place Link</label>
//                             <input
//                               type="text"
//                               value={place.placeLink || ""}
//                               onChange={(e) => handlePlaceChange(index, "placeLink", e.target.value)}
//                               placeholder="https://example.com"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Place Image</label>
//                             <input
//                               type="file"
//                               accept={VALID_FILE_TYPES.join(",")}
//                               onChange={(e) => handlePlaceImageChange(index, e.target.files[0])}
//                               className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                             /> 
//                             <p className="mt-1 text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     <button 
//                       type="button" 
//                       onClick={handleAddPlace}
//                       className="w-full mt-4 px-4 py-3 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                       </svg>
//                       Add Another Place
//                     </button>
//                   </div>
//                 </div>

//                 {/* HOTELS SECTION */}
//                 <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//                   <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
//                     <h3 className="text-xl font-bold text-white flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                       Accommodations
//                     </h3>
//                   </div>
//                   <div className="p-6">
//                     {hotels.map((hotel, index) => (
//                       <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 last:mb-0">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-lg font-semibold text-gray-800">Hotel #{index + 1}</h4>
//                           <button 
//                             type="button" 
//                             onClick={() => handleRemoveHotel(index)}
//                             className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Remove
//                           </button>
//                         </div>
//                         <div className="grid md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Hotel Name *</label>
//                             <input
//                               type="text"
//                               value={hotel.hotelName || ""}
//                               onChange={(e) => handleHotelChange(index, "hotelName", e.target.value)}
//                               required
//                               placeholder="e.g., Grand Hotel"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Hotel Price ($)</label>
//                             <input
//                               type="number"
//                               value={hotel.hotelPrice || ""}
//                               onChange={(e) => handleHotelChange(index, "hotelPrice", e.target.value)}
//                               placeholder="e.g., 150"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Hotel Link</label>
//                             <input
//                               type="text"
//                               value={hotel.hotelLink || ""}
//                               onChange={(e) => handleHotelChange(index, "hotelLink", e.target.value)}
//                               placeholder="https://example.com"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Hotel Image</label>
//                             <input
//                               type="file"
//                               accept={VALID_FILE_TYPES.join(",")}
//                               onChange={(e) => handleHotelImageChange(index, e.target.files[0])}
//                               className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                             /> 
//                             <p className="mt-1 text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     <button 
//                       type="button" 
//                       onClick={handleAddHotel}
//                       className="w-full mt-4 px-4 py-3 bg-green-100 text-green-700 font-medium rounded-md hover:bg-green-200 transition-colors duration-200 flex items-center justify-center"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                       </svg>
//                       Add Another Hotel
//                     </button>
//                   </div>
//                 </div>

//                 {/* TRANSPORTATION SECTION */}
//                 <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//                   <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
//                     <h3 className="text-xl font-bold text-white flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                       </svg>
//                       Transportation
//                     </h3>
//                   </div>
//                   <div className="p-6">
//                     {transportations.map((transportation, index) => (
//                       <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 last:mb-0">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-lg font-semibold text-gray-800">Transport #{index + 1}</h4>
//                           <button 
//                             type="button" 
//                             onClick={() => handleRemoveTransportation(index)}
//                             className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Remove
//                           </button>
//                         </div>
//                         <div className="grid md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Transport Type *</label>
//                             <input
//                               type="text"
//                               value={transportation.transportationName || ""}
//                               onChange={(e) => handleTransportationChange(index, "transportationName", e.target.value)}
//                               required
//                               placeholder="e.g., Metro, Rental Car, Train"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Transport Price ($)</label>
//                             <input
//                               type="number"
//                               value={transportation.transportationPrice || ""}
//                               onChange={(e) => handleTransportationChange(index, "transportationPrice", e.target.value)}
//                               placeholder="e.g., 35"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Transport Link</label>
//                             <input
//                               type="text"
//                               value={transportation.transportationLink || ""}
//                               onChange={(e) => handleTransportationChange(index, "transportationLink", e.target.value)}
//                               placeholder="https://example.com"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700 font-medium mb-1">Transport Image</label>
//                             <input
//                               type="file"
//                               accept={VALID_FILE_TYPES.join(",")}
//                               onChange={(e) => handleTransportationImageChange(index, e.target.files[0])}
//                               className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue--100"
//                             />
//                           </div>
//                         </div>
//                         <button 
//                             type="button" 
//                             onClick={handleAddTransportation}
//                             className="w-full mt-4 px-4 py-3 bg-green-100 text-green-700 font-medium rounded-md hover:bg-green-200 transition-colors duration-200 flex items-center justify-center"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                             </svg>
//                             Add Another Transportation
//                           </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="w-full px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
//                 >
//                   Submit Itinerary
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </main>
//     </section>
// )}

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddItinerary = () => {
  const [city, setCity] = useState('');
  const [userBudget, setUserBudget] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [itinerary, setItinerary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setItinerary(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3000/api/itineraries',
        { city, userBudget, totalDays },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItinerary(res.data);
      toast.success('Itinerary generated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        style: { background: '#e6f3fa', color: '#1e3a8a' },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        style: { background: '#fee2e2', color: '#991b1b' },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center tracking-tight">
          Travel Admin: Plan Your Journey
        </h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
              Destination City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400"
              placeholder="Enter your dream destination"
              required
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">
              Budget (₹)
            </label>
            <input
              id="budget"
              type="number"
              value={userBudget}
              onChange={(e) => setUserBudget(e.target.value)}
              className="mt-2 w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400"
              placeholder="Enter your travel budget"
              required
            />
          </div>

          <div>
            <label htmlFor="days" className="block text-sm font-semibold text-gray-700">
              Total Days
            </label>
            <input
              id="days"
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              className="mt-2 w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400"
              placeholder="Enter number of travel days"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 shadow-md transform hover:scale-105"
          >
            Craft Your Itinerary
          </button>
        </div>

        {itinerary && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">
              Your Adventure in {itinerary.city}
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800">Stay</h3>
              <p className="text-gray-700">
                {itinerary.selectedHotel.Name} - ₹{itinerary.selectedHotel.Price} / night
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800">Daily Itinerary</h3>
              <ul className="mt-3 space-y-4">
                {itinerary.dailyPlan.map((day, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-lg p-4 shadow-sm text-gray-700"
                  >
                    <span className="font-semibold text-blue-800">Day {day.day}:</span>{' '}
                    {day.places.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};