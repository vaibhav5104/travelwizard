// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../store/auth";

// export const AdminItinerary = () => {
//     const { isAuthenticated, user, isLoading } = useAuth();
    
//     const [itineraries, setItineraries] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch all itineraries
//     useEffect(() => {
//         fetch("${API}/api/itineraries")
//             .then(res => res.json())
//             .then(data => {
//                 setItineraries(data);
//                 console.log("Iteneraries : ",itineraries);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error("Error fetching itineraries:", err);
//                 setLoading(false);
//             });
//     }, []);
    
//     if (isLoading) {
//         return <div>Loading...</div>; // Prevents redirect before auth check
//     }
    
//     if (!isAuthenticated || !user?.isAdmin) {
//         return <Navigate to="/" />;
//     }

//     // Handle update itinerary
//     const handleUpdate = async (itineraryId) => {
//         const updatedBudget = prompt("Enter new budget:");
//         const updatedDays = prompt("Enter new days:");
        
//         if (!updatedBudget || !updatedDays) return;
        
//         try {
//             const response = await fetch(`${API}/api/itineraries/${itineraryId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ 
//                     budget: Number(updatedBudget),
//                     days: Number(updatedDays)
//                 }),
//             });
    
//             const data = await response.json();
//             if (response.ok) {
//                 alert(data.message);
//                 setItineraries((prev) =>
//                     prev.map((itinerary) => 
//                         itinerary._id === itineraryId 
//                             ? { ...itinerary, budget: Number(updatedBudget), days: Number(updatedDays) } 
//                             : itinerary
//                     )
//                 );
//             } else {
//                 alert(data.message);
//             }
//         } catch (error) {
//             console.error("Error updating itinerary:", error);
//         }
//     };

//     // Handle delete itinerary
//     const handleDelete = async (itineraryId) => {
//         if (!window.confirm("Are you sure you want to delete this itinerary?")) return;
    
//         try {
//             const response = await fetch(`${API}/api/itineraries/${itineraryId}`, {
//                 method: "DELETE",
//             });
    
//             const data = await response.json();
//             if (response.ok) {
//                 alert(data.message);
//                 setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== itineraryId));
//             } else {
//                 alert(data.message);
//             }
//         } catch (error) {
//             console.error("Error deleting itinerary:", error);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex items-center justify-between mb-6">
//                     <h1 className="text-3xl font-bold text-gray-800">Itineraries Dashboard</h1>
//                     <div className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md">
//                         Total Itineraries: {itineraries?.length || 0}
//                     </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                     <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600">
//                         <h2 className="text-xl font-semibold text-white">Itineraries Overview</h2>
//                     </div>
                    
//                     {loading ? (
//                         <div className="flex justify-center items-center h-64">
//                             <div className="text-gray-500">Loading itineraries data...</div>
//                         </div>
//                     ) : (
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-100">
//                                     <tr>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             City Name
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Budget
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Days
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Places Count
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Hotels Count
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Transportation Count
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Update
//                                         </th>
//                                         <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                             Delete
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {itineraries && itineraries.length > 0 ? itineraries.map((itinerary) => (
//                                         <tr key={itinerary._id} className="hover:bg-purple-50 transition-colors duration-150">
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <div className="font-medium text-gray-900">{itinerary.name}</div>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <div className="text-gray-900">${itinerary.budget}</div>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <div className="text-gray-900">{itinerary.days}</div>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <div className="bg-green-100 text-green-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
//                                                     {itinerary.places?.placeName?.length || 0} places
//                                                 </div>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <div className="bg-blue-100 text-blue-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
//                                                     {itinerary.hotels?.hotelName?.length || 0} hotels
//                                                 </div>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <div className="bg-yellow-100 text-yellow-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
//                                                     {itinerary.transportation?.transportationName?.length || 0} transports
//                                                 </div>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <button
//                                                     onClick={() => handleUpdate(itinerary._id)}
//                                                     className="bg-purple-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-purple-700 transition"
//                                                 >
//                                                     Update
//                                                 </button>
//                                             </td>
//                                             <td className="py-4 px-6 whitespace-nowrap">
//                                                 <button
//                                                     onClick={() => handleDelete(itinerary._id)}
//                                                     className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 transition"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     )) : (
//                                         <tr>
//                                             <td colSpan="8" className="py-8 text-center text-gray-500">
//                                                 <div className="flex flex-col items-center justify-center">
//                                                     <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12h-9a2 2 0 01-2-2v-5m11 0a2 2 0 012-2v6"></path>
//                                                     </svg>
//                                                     <p>No itineraries found in the database</p>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
                
//                 <div className="mt-6 text-sm text-gray-500 text-right">
//                     Updated: {new Date().toLocaleString()}
//                 </div>
//             </div>
//         </div>
//     );
// };

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export const AdminItinerary = () => {
    const { API,isAuthenticated, user, isLoading } = useAuth();
    
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/itineraries`)
            .then(res => res.json())
            .then(data => {
                setItineraries(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching itineraries:", err);
                setLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" />;
    }

    const handleUpdate = async (itineraryId) => {
        const updatedBudget = prompt("Enter new budget:");
        const updatedDays = prompt("Enter new days:");

        if (!updatedBudget || !updatedDays) return;

        try {
            const response = await fetch(`${API}/api/itineraries/${itineraryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userBudget: Number(updatedBudget),
                    totalDays: Number(updatedDays),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setItineraries((prev) =>
                    prev.map((itinerary) =>
                        itinerary._id === itineraryId
                            ? { ...itinerary, userBudget: Number(updatedBudget), totalDays: Number(updatedDays) }
                            : itinerary
                    )
                );
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error updating itinerary:", error);
        }
    };

    const handleDelete = async (itineraryId) => {
        if (!window.confirm("Are you sure you want to delete this itinerary?")) return;

        try {
            const response = await fetch(`${API}/api/itineraries/${itineraryId}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== itineraryId));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting itinerary:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Itineraries Dashboard</h1>
                    <div className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md">
                        Total Itineraries: {itineraries?.length || 0}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600">
                        <h2 className="text-xl font-semibold text-white">Itineraries Overview</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Loading itineraries data...</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">City Name</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Budget</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Days</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Places Count</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Hotels Count</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Transportation Count</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Update</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {itineraries && itineraries.length > 0 ? (
                                        itineraries.map((itinerary) => (
                                            <tr key={itinerary._id} className="hover:bg-purple-50 transition-colors duration-150">
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{itinerary.city}</div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="text-gray-900">₹{itinerary.userBudget}</div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="text-gray-900">{itinerary.totalDays}</div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="bg-green-100 text-green-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
                                                        {itinerary.selectedPlaces?.length || 0} places
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="bg-blue-100 text-blue-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
                                                        {itinerary.selectedHotel ? 1 : 0} hotel
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="bg-yellow-100 text-yellow-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
                                                        0 transports
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleUpdate(itinerary._id)}
                                                        className="bg-purple-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-purple-700 transition"
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDelete(itinerary._id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12h-9a2 2 0 01-2-2v-5m11 0a2 2 0 012-2v6" />
                                                    </svg>
                                                    <p>No itineraries found in the database</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-sm text-gray-500 text-right">
                    Updated: {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
};
