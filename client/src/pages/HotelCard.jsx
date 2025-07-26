// src/components/HotelCard.jsx
import React from "react";
const HotelCard = ({ hotel }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel['Hotel Name']}</h3>
          
          <div className="flex items-center mb-3">
            {hotel.Rating !== 'N/A' && (
              <div className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded mr-2">
                {hotel.Rating}
              </div>
            )}
            <span className="text-sm text-gray-600">{hotel['Hotel Type']}</span>
          </div>
          
          {hotel.Location !== 'N/A' && (
            <div className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Location:</span> {hotel.Location}
            </div>
          )}
          
          {hotel.Amenities !== 'N/A' && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Amenities</h4>
              <p className="text-sm text-gray-600">{hotel.Amenities}</p>
            </div>
          )}
          
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium text-gray-700 mr-2">Couple Friendly:</span>
            {hotel['Couple Friendly'] === 'Yes' ? (
              <span className="text-green-600 text-sm">Yes</span>
            ) : (
              <span className="text-red-600 text-sm">No</span>
            )}
          </div>
          
          {hotel.Inclusions !== 'N/A' && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Inclusions</h4>
              <p className="text-sm text-gray-600">{hotel.Inclusions}</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="text-lg font-bold text-blue-600">{hotel.Price}</div>
              <div className="text-xs text-gray-500">{hotel['Taxes & Fees']}</div>
            </div>
            
            <a 
              href={hotel.URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  export default HotelCard;