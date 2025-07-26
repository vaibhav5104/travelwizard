const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  distance: { type: Number }, // distance from city center or reference point
  description: { type: String },
  budget: { type: Number, default: 0 },
  latitude: { type: Number },
  longitude: { type: Number }
});

const cityPlacesSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  places: [placeSchema]
});

module.exports = mongoose.model('CityPlaces', cityPlacesSchema);