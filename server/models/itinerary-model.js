const mongoose = require('mongoose');
const computeFeatureVector = require('../utils/featureVector');

const itinerarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  userBudget: { type: Number, required: true },
  totalDays: { type: Number, required: true },

  selectedHotel: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    Name: String,
    Price: Number,
    Address: String,
    Rating: Number,
    URL: String
  },

  selectedPlaces: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: String,
      rating: Number,
      distance: Number,
      budget: Number,
      description: String,
      latitude: Number,
      longitude: Number
    }
  ],

  luxury_score: { type: Number, default: 0 },
  budget_score: { type: Number, default: 0 },
  midrange_score: { type: Number, default: 0 },

  featureVector: { type: [Number], default: [] },

  dailyPlan: [
    {
      day: Number,
      places: [String]
    }
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  isPublic: {
    type: Boolean,
    default: true
  },

  createdAt: { type: Date, default: Date.now }
});


  itinerarySchema.pre('save', function (next) {
  if (!this.owner) {
    return next(new Error('Owner is required when creating an itinerary.'));
  }

  if (!this.selectedHotel || !this.selectedPlaces.length) {
  return next(new Error('Cannot compute feature vector without hotel and places'));
  }

  const result = computeFeatureVector(this);
  this.budget_score = result.budget_score;
  this.midrange_score = result.midrange_score;
  this.luxury_score = result.luxury_score;
  this.featureVector = result.featureVector;

  next();
});


module.exports = mongoose.model('Itinerary', itinerarySchema)
