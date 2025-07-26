const mongoose = require('mongoose');
const cityFeatureVector = require('../utils/cityFeatureVector');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    cityImage: [{ type: String, required: true }],
    blog: { type: String, required: true },
    mapUrl: { type: String },
    itineraryCount: { type: Number, default: 0 },
    rating: { type: Number, required: true },
    ideal_time: { type: String, required: true },
    best_time_to_visit: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },

    featureVector: {
    summer_score: { type: Number, default: 0 },
    winter_score: { type: Number, default: 0 },
    monsoon_score: { type: Number, default: 0 },
    allyear: { type: Number, default: 0 }
    }

});

// Middleware
citySchema.pre('save', async function (next) {
    if (!this.mapUrl) {
        const encodedName = encodeURIComponent(this.name);
        this.mapUrl = `https://www.google.com/maps`;
    }

    this.featureVector = cityFeatureVector(this.best_time_to_visit);
    next();
});

const City = mongoose.model("City", citySchema);
module.exports = City;
