const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  _id: { type: String },
  Name: String,
  URL: String,
  Total_Rating: String,
  Review_Score: String,
  New_Total: Number,
  Code: Number,
  Rating: Number,
  City_y: String,
  Amenities: { type: [String], default: [] },
  Latitude: Number,
  Longitude: Number,
  Price: Number,
  Address: String,
  City: String,
  CityLabel: Number,
  cluster: Number
});

const cityHotelsSchema = new mongoose.Schema({
  city: { type: String, required: true },
  hotels: [hotelSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("CityHotels", cityHotelsSchema);