const axios = require("axios");
const CityHotels = require("../models/hotel-model");
const mongoose = require("mongoose")

// GET all cities with hotels
const getAllCities = async (req, res) => {
  try {
    const cities = await CityHotels.find();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET hotels by city
const getHotelsByCity = async (req, res) => {
  try {
    const city = await CityHotels.findOne({
      city: { $regex: new RegExp(`^${req.params.city}$`, "i") }
    });
        if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json(city.hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Add a new city with hotels
const addCityWithHotels = async (req, res) => {
  try {
    const newCity = new CityHotels(req.body);
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT: Update hotels in a city
const updateHotelsByCity = async (req, res) => {
  try {
    const updatedCity = await CityHotels.findOneAndUpdate(
      { city: req.params.city },
      { $set: { hotels: req.body.hotels } },
      { new: true }
    );
    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json(updatedCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Remove a city
const deleteCity = async (req, res) => {
  try {
    const result = await CityHotels.findOneAndDelete({ city: req.params.city });
    if (!result) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


async function geocodeAddress(hotelName, cityName) {
  const query = `${hotelName}, ${cityName}, India`;

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: query,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "TourismApp (your-email@example.com)" // Use a real email!
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error(`❌ Geocoding failed for ${query}: ${err.message}`);
    return null;
  }
}

async function updateHotelCoordinates() {
  const cityDocs = await CityHotels.find({});
  let totalUpdated = 0;

  for (const cityDoc of cityDocs) {
    let updated = false;

    for (const hotel of cityDoc.hotels) {
      if (!hotel.Latitude || !hotel.Longitude || hotel.Latitude === 0 || hotel.Longitude === 0) {
        const coords = await geocodeAddress(hotel.Name, cityDoc.city);
        if (coords) {
          hotel.Latitude = coords.lat;
          hotel.Longitude = coords.lon;
          updated = true;
          totalUpdated++;
          console.log(`✅ Updated: ${hotel.Name} (${cityDoc.city})`);
        } else {
          console.warn(`❌ Could not geocode: ${hotel.Name} (${cityDoc.city})`);
        }

        await new Promise(res => setTimeout(res, 1000)); // Respect Nominatim rate limit
      }
    }

    if (updated) {
      await cityDoc.save();
      console.log(`💾 Saved: ${cityDoc.city}`);
    }
  }

  console.log(`🎉 Done updating ${totalUpdated} hotels.`);
  mongoose.disconnect();
}

module.exports = {getAllCities,deleteCity,updateHotelsByCity,getHotelsByCity,addCityWithHotels,updateHotelCoordinates}