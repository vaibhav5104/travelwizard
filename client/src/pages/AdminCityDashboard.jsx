import React from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"
import { useAuth } from "../store/auth"

const AdminCity = () => {
    const { API,isAuthenticated, user, isLoading } = useAuth();

    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    

    const handleUpdate = async (cityId) => {
        const updatedName = prompt("Enter new city name:");
        if (!updatedName) return;
    
        try {
            const response = await fetch(`${API}/api/tour/city/${cityId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: updatedName }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setCities((prev) =>
                    prev.map((city) => (city._id === cityId ? { ...city, name: updatedName } : city))
                );
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error updating city:", error);
        }
    };

    const handleDelete = async (cityId) => {
        if (!window.confirm("Are you sure you want to delete this city?")) return;
    
        try {
            const response = await fetch(`${API}/api/tour/city/${cityId}`, {
                method: "DELETE",
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setCities((prev) => prev.filter((city) => city._id !== cityId));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting city:", error);
        }
    };
    
    
    useEffect(() => {
        fetch(`${API}/api/tour/city/`)
            .then(res => res.json())
            .then(data => {
                setCities(data.cities);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching cities:", err);
                setLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Prevents redirect before auth check
    }
    
    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Cities Dashboard</h1>
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
                        Total Cities: {cities.length}
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
                        <h2 className="text-xl font-semibold text-white">Cities Overview</h2>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Loading cities data...</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            City Name
                                        </th>
                                        {/* <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Event Count
                                        </th> */}
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Itinerary Count
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Update City
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Delete City
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cities.length > 0 ? cities.map((city) => (
                                        <tr key={city._id} className="hover:bg-blue-50 transition-colors duration-150">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{city.name}</div>
                                            </td>
                                            {/* <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="bg-green-100 text-green-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
                                                    {city.events?.eventName?.length || 0} events
                                                </div>
                                            </td> */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="bg-purple-100 text-purple-800 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full">
                                                    {city.itineraryCount} itineraries
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleUpdate(city._id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-700 transition"
                                                >
                                                    Update City
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDelete(city._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 transition"
                                                >
                                                    Delete City
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12h-9a2 2 0 01-2-2v-5m11 0a2 2 0 012-2v6"></path>
                                                    </svg>
                                                    <p>No cities found in the database</p>
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
}
export default AdminCity