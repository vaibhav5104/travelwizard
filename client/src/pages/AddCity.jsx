// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../store/auth";
// import { Navigate } from "react-router-dom";

// export const AddCity = () => {
//   const { user, isLoading, isAuthenticated, API, authorizationToken } = useAuth();

//   const [cityData, setCityData] = useState({
//     name: "",
//     blog: "",
//     mapUrl: "",
//     rating: "",
//     ideal_time: "",
//     best_time_to_visit: "",
//     state: "",
//     country: "",
//   });

//   // const [events, setEvents] = useState([{ eventName: "", eventImage: "", eventLink: "" }]);
//   const [cityImages, setCityImages] = useState([]);

//   if (isLoading) return <h1 className="text-center mt-24 text-xl font-bold">Loading ...</h1>;
//   if (!isAuthenticated || !user?.isAdmin) return <Navigate to="/" />;

//   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
//   const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

//   const handleChange = (e) => {
//     setCityData({ ...cityData, [e.target.name]: e.target.value });
//   };

//   // const handleEventChange = (index, field, value) => {
//   //   const updatedEvents = [...events];
//   //   updatedEvents[index][field] = value;
//   //   setEvents(updatedEvents);
//   // };

//   // const handleAddEvent = () => {
//   //   setEvents([...events, { eventName: "", eventImage: "", eventLink: "" }]);
//   // };

//   // const handleRemoveEvent = (index) => {
//   //   setEvents(events.filter((_, i) => i !== index));
//   // };

//   const handleCityImageChange = (file) => {
//     if (!file || !VALID_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
//       toast.error(`Invalid file: ${file?.name}`);
//       return;
//     }
//     setCityImages([...cityImages, file]);
//   };

//   const handleRemoveCityImage = (index) => {
//     setCityImages(cityImages.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!cityData.name || !cityData.blog || !cityData.rating || !cityData.ideal_time || !cityData.best_time_to_visit || !cityData.state || !cityData.country) {
//       toast.error("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     Object.keys(cityData).forEach((key) => {
//       formData.append(key, cityData[key]);
//     });

//     // events.forEach((event, index) => {
//     //   formData.append(`eventName[${index}]`, event.eventName);
//     //   formData.append(`eventImageUrls[${index}]`, event.eventImage);
//     //   formData.append(`eventLink[${index}]`, event.eventLink);
//     // });

//     cityImages.forEach((image) => formData.append("cityImages", image));

//     try {
//       const response = await fetch(`${API}/api/admin/add/city`, {
//         method: "POST",
//         body: formData,
//         headers: { Authorization: authorizationToken },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         toast.success(result.message || "City added successfully!");
//         setCityData({ name: "", blog: "", mapUrl: "", rating: "", ideal_time: "", best_time_to_visit: "", state: "", country: "" });
//         // setEvents([{ eventName: "", eventImage: "", eventLink: "" }]);
//         setCityImages([]);
//       } else {
//         toast.error(result.message || "Failed to add city");
//       }
//     } catch (error) {
//       toast.error("An error occurred while adding the city");
//     }
//   };

//   return (
//     <div className="py-12 bg-gradient-to-b from-blue-50 to-white min-h-screen flex justify-center">
//       <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="bg-blue-600 py-4">
//           <h2 className="text-center text-2xl font-bold text-white">Add City</h2>
//         </div>

//         <div className="p-6 md:p-8">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {[
//               { label: "City Name", name: "name", type: "text" },
//               { label: "Blog", name: "blog", type: "textarea" },
//               { label: "Rating", name: "rating", type: "number" },
//               { label: "Ideal Time", name: "ideal_time", type: "text" },
//               { label: "Best Time to Visit", name: "best_time_to_visit", type: "text" },
//               { label: "State", name: "state", type: "text" },
//               { label: "Country", name: "country", type: "text" },
//             ].map((field, index) => (
//               <div key={index}>
//                 <label className="block text-gray-700">{field.label}</label>
//                 {field.type === "textarea" ? (
//                   <textarea name={field.name} value={cityData[field.name]} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
//                 ) : (
//                   <input type={field.type} name={field.name} value={cityData[field.name]} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
//                 )}
//               </div>
//             ))}

//             {/* City Images */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">City Images</label>
//               {/* Modern styled file input */}
//               <div className="relative">
//                 <input 
//                   type="file" 
//                   accept="image/*" 
//                   id="cityImageUpload" 
//                   className="hidden" 
//                   onChange={(e) => handleCityImageChange(e.target.files[0])} 
//                 />
//                 <label 
//                   htmlFor="cityImageUpload" 
//                   className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-500 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 hover:shadow"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Choose Image
//                 </label>
//               </div>
              
//               {/* Display selected images */}
//               <div className="flex flex-wrap mt-3">
//                 {cityImages.map((image, index) => (
//                   <div key={index} className="relative w-20 h-20 m-2">
//                     <img 
//                       src={URL.createObjectURL(image)} 
//                       alt="City" 
//                       className="w-full h-full object-cover rounded-md shadow-md" 
//                     />
//                     <button 
//                       type="button" 
//                       onClick={() => handleRemoveCityImage(index)} 
//                       className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs h-6 w-6 flex items-center justify-center shadow-sm transition-colors duration-200"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>


//             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
//               Submit
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCity;
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddCity = () => {
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