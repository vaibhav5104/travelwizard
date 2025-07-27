import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddItinerary = () => {
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
export default AddItinerary