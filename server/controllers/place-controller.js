const CityPlaces = require("../models/place-model");

// Get all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await CityPlaces.find({});
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// Get city by name (case-insensitive)
const getCityByName = async (req, res) => {
  const cityName = req.params.name;

  try {
    const city = await CityPlaces.findOne({ city: new RegExp(`^${cityName}$`, 'i') });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(city);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch city" });
  }
};

module.exports = {getCityByName,getAllCities}