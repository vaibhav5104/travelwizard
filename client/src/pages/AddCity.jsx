// export default AddCity;
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCity = () => {
  const [formData, setFormData] = useState({
    name: '',
    cityImage: [''],
    blog: '',
    mapUrl: '',
    itineraryCount: '',
    rating: '',
    ideal_time: '',
    best_time_to_visit: '',
    state: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('cityImage')) {
      const index = parseInt(name.split('-')[1]);
      const newImages = [...formData.cityImage];
      newImages[index] = value;
      setFormData({ ...formData, cityImage: newImages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, cityImage: [...formData.cityImage, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/add/city',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setFormData({
        name: '',
        cityImage: [''],
        blog: '',
        mapUrl: '',
        itineraryCount: '',
        rating: '',
        ideal_time: '',
        best_time_to_visit: '',
        state: '',
        country: ''
      });

      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        style: { background: '#e6f3fa', color: '#1e3a8a' },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
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
        <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center tracking-tight">
          Travel Admin: Add New City
        </h2>

        <div className="space-y-6">
          {[
            ['name', 'City Name'],
            ['blog', 'City Blog'],
            ['mapUrl', 'Map URL'],
            ['itineraryCount', 'Itinerary Count (optional)'],
            ['rating', 'Rating (out of 5)'],
            ['ideal_time', 'Ideal Time (e.g., 3-5 days)'],
            ['best_time_to_visit', 'Best Time to Visit (e.g., July)'],
            ['state', 'State'],
            ['country', 'Country']
          ].map(([field, label]) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-semibold text-gray-700">
                {label}
              </label>
              <input
                id={field}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={field !== 'mapUrl' && field !== 'itineraryCount'}
                className="mt-2 w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City Images
            </label>
            {formData.cityImage.map((img, index) => (
              <input
                key={index}
                type="text"
                name={`cityImage-${index}`}
                value={img}
                onChange={handleChange}
                required
                placeholder={`Image URL ${index + 1}`}
                className="mb-3 w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 placeholder-gray-400"
              />
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition duration-200"
            >
              + Add another image
            </button>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 shadow-md transform hover:scale-105"
          >
            Add City
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCity