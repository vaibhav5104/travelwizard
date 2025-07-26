const Itinerary = require('../models/itinerary-model');
const User = require('../models/user-model');
const CityHotels = require('../models/hotel-model');
const CityPlaces = require('../models/place-model');
const mongoose = require('mongoose');
const { cosineSimilarity } = require('../utils/cosineSimilarity');

const createItinerary = async (req, res) => {
  const { city, userBudget, totalDays } = req.body;

  try {
    // Fetch hotels & places for the city
    const cityHotelsData = await CityHotels.findOne({ city });
    const cityPlacesData = await CityPlaces.findOne({ city });

    if (!cityHotelsData || !cityPlacesData) {
      return res.status(404).json({ message: 'Hotels or places not found for this city' });
    }

    const hotels = cityHotelsData.hotels || [];
    const places = cityPlacesData.places || [];

    // Fetch user's existing itineraries for the city
    const userItineraries = await Itinerary.find({ city, owner: req.userID });

    const previouslySelectedHotelIds = userItineraries.map(it => it.selectedHotel._id.toString());
    const previouslySelectedPlaceIds = new Set(
      userItineraries.flatMap(it => it.selectedPlaces.map(p => p._id.toString()))
    );

    // Hotel selection (now considering total cost for all days)
    const sortedHotels = hotels
      .filter(hotel => {
        const totalHotelCost = hotel.Price * totalDays;
        return (
          !previouslySelectedHotelIds.includes(hotel._id.toString()) &&
          totalHotelCost <= userBudget
        );
      })
      .sort((a, b) => {
        const diffA = Math.abs((a.Price * totalDays) - userBudget / 2);
        const diffB = Math.abs((b.Price * totalDays) - userBudget / 2);
        return diffA - diffB;
      });

    if (sortedHotels.length === 0) {
      return res.status(400).json({ message: 'No new hotels available within total budget' });
    }

    const selectedHotel = sortedHotels[0];
    const totalHotelCost = selectedHotel.Price * totalDays;
    const remainingBudget = userBudget - totalHotelCost;

    if (remainingBudget <= 0) {
      return res.status(400).json({ message: 'Hotel cost exceeds total budget' });
    }

    // Select places (2–3 per day) within remaining budget and avoid repetition
    const sortedPlaces = places
      .filter(place => !previouslySelectedPlaceIds.has(place._id.toString()))
      .sort((a, b) => b.rating - a.rating);

    const selectedPlaces = [];
    let totalPlaceBudget = 0;
    const dailyPlan = [];

    for (let i = 0; i < totalDays; i++) {
      let dayPlaces = [];
      let count = 0;

      for (let place of sortedPlaces) {
        const estimatedCost = place.budget || 300;

        if (!selectedPlaces.find(p => p._id.equals(place._id)) && 
            (totalPlaceBudget + estimatedCost <= remainingBudget) &&
            count < 3) {
          selectedPlaces.push(place);
          dayPlaces.push(place.name);
          totalPlaceBudget += estimatedCost;
          count++;
        }

        if (count >= 3) break;
      }

      if (dayPlaces.length > 0) {
        dailyPlan.push({ day: i + 1, places: dayPlaces });
      }
    }

    if (selectedPlaces.length === 0) {
      return res.status(400).json({ message: "Not enough unique places to create an itinerary." });
    }

    // Save itinerary
    const newItinerary = new Itinerary({
      city,
      userBudget,
      totalDays,
      selectedHotel: {
        _id: selectedHotel._id,
        Name: selectedHotel.Name,
        Price: selectedHotel.Price,
        Address: selectedHotel.Address,
        Rating: selectedHotel.Rating,
        URL: selectedHotel.URL
      },
      selectedPlaces: selectedPlaces.map(place => ({
        _id: place._id,
        name: place.name,
        rating: place.rating,
        distance: place.distance,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude
      })),
      dailyPlan,
      owner: req.userID,
    });

    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);

  } catch (err) {
    console.error("Itinerary creation error:", err);
    res.status(500).json({ error: 'Failed to create itinerary', details: err.message });
  }
};

// Get all itineraries for a specific city
const getCityItineraries = async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({
        message: "Please provide 'city' parameter.",
      });
    }

    // Find all itineraries for the specified city (case-insensitive)
    const itineraries = await Itinerary.find({ 
      city: { $regex: new RegExp(city, "i") },
      // isPublic: true // Only return public itineraries
    }).sort({ createdAt: -1 }); // Sort by newest first

    if (itineraries.length === 0) {
      return res.status(404).json({ 
        message: `No itineraries found for ${city}.`,
        city: city
      });
    }

    // Group itineraries by duration for better organization
    const groupedItineraries = itineraries.reduce((acc, itinerary) => {
      const duration = itinerary.totalDays;
      if (!acc[duration]) {
        acc[duration] = [];
      }
      acc[duration].push(itinerary);
      return acc;
    }, {});

    // Calculate some statistics
    const stats = {
      totalItineraries: itineraries.length,
      averageBudget: Math.round(itineraries.reduce((sum, it) => sum + it.userBudget, 0) / itineraries.length),
      budgetRange: {
        min: Math.min(...itineraries.map(it => it.userBudget)),
        max: Math.max(...itineraries.map(it => it.userBudget))
      },
      durationRange: {
        min: Math.min(...itineraries.map(it => it.totalDays)),
        max: Math.max(...itineraries.map(it => it.totalDays))
      },
      groupedByDuration: Object.keys(groupedItineraries).map(duration => ({
        days: parseInt(duration),
        count: groupedItineraries[duration].length
      })).sort((a, b) => a.days - b.days)
    };

    res.status(200).json({
      city: city,
      stats: stats,
      itineraries: itineraries,
      groupedItineraries: groupedItineraries
    });

  } catch (err) {
    console.error("Error finding city itineraries:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

// const getCityItineraries = async (req, res) => {
//   try {
//     let { city } = req.params;

//     if (!city || city.trim() === "") {
//       return res.status(400).json({
//         message: "City parameter is required."
//       });
//     }

//     city = city.trim();

//     const itineraries = await Itinerary.find({
//       city: { $regex: `^${city}$`, $options: "i" }, // Exact match, case-insensitive
//       // isPublic: true
//     });

//     if (itineraries.length === 0) {
//       return res.status(404).json({ message: "No itineraries found for this city." });
//     }

//     res.status(200).json(itineraries);
//   } catch (err) {
//     console.error("Error getting city itineraries:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };



// Get all itineraries

const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one itinerary by ID
const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Not found' });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete itinerary
const deleteItinerary = async (req, res) => {
  try {
    const deleted = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update itinerary
const updateItinerary = async (req, res) => {
  try {
    const updated = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFilteredItineraries = async (req, res) => {
    try {
        const { city, budget, days } = req.query;

        if (!city || !budget || !days) {
            return res.status(400).json({
                message: "Please provide 'city', 'budget', and 'days' query parameters.",
            });
        }

        const itineraries = await Itinerary.find({
          city: { $regex: new RegExp(city, "i") }
        }).populate({
          path: 'owner',
          select: 'username email phone' // Choose what fields you want
        });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: "No itineraries found for this city." });
        }

        const targetBudget = Number(budget);
        const targetDays = Number(days);

        // Sort by closest match to budget and days
        itineraries.sort((a, b) => {
            const aDiff = Math.abs(a.userBudget - targetBudget) + Math.abs(a.totalDays - targetDays);
            const bDiff = Math.abs(b.userBudget - targetBudget) + Math.abs(b.totalDays - targetDays);
            return aDiff - bDiff;
        });

        // Send top 1–3 best-matched itineraries
        const bestMatches = itineraries.slice(0, 3);

        res.status(200).json(bestMatches);
    } catch (err) {
        console.error("Error finding best-matched itineraries:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// const cloneItinerary = async (req, res) => {
//     try {
//         const userId = req.userID;
//         const { publicItineraryId } = req.body;

//         if (!publicItineraryId) {
//             return res.status(400).json({ message: "Public itinerary ID is required" });
//         }

//         // Step 1: Fetch the original itinerary
//         const originalItinerary = await Itinerary.findById(publicItineraryId);
//         if (!originalItinerary) {
//             return res.status(404).json({ message: "Itinerary not found" });
//         }

//         // Step 2: Clone data and customize
//         const clonedItinerary = new Itinerary({
//           city: originalItinerary.city,
//           userBudget: originalItinerary.userBudget,
//           totalDays: originalItinerary.totalDays,
        
//           selectedHotel: {
//             _id: originalItinerary.selectedHotel._id,
//             Name: originalItinerary.selectedHotel.Name,
//             Price: originalItinerary.selectedHotel.Price,
//             Address: originalItinerary.selectedHotel.Address,
//             Rating: originalItinerary.selectedHotel.Rating,
//             URL: originalItinerary.selectedHotel.URL
//           },
        
//           selectedPlaces: originalItinerary.selectedPlaces.map(place => ({
//             _id: place._id,
//             name: place.name,
//             rating: place.rating,
//             distance: place.distance,
//             description: place.description,
//             latitude: place.latitude,
//             longitude: place.longitude
//           })),
        
//           dailyPlan: JSON.parse(JSON.stringify(originalItinerary.dailyPlan)), // deep copy
//           owner: userId, // new owner
//           isPublic: false // cloned itineraries are private by default
//         });
        
//         // Step 3: Save the cloned itinerary
//         const savedClone = await clonedItinerary.save();

//         // Step 4: Attach to user’s account
//         await User.findByIdAndUpdate(userId, {
//             $push: { itineraries: savedClone._id }
//         });

//         res.status(201).json({
//             message: "Itinerary cloned successfully",
//             itinerary: savedClone
//         });
//     } catch (error) {
//         console.error("cloneItinerary error:", error);
//         res.status(500).json({ message: "Server error while cloning itinerary" });
//     }
// };

const saveItinerary = async (req, res) => {
  try {
    const userId = req.userID;
    const { publicItineraryId } = req.body;

    if (!publicItineraryId) {
      return res.status(400).json({ message: "Itinerary ID is required" });
    }

    // Check if the itinerary exists
    const itinerary = await Itinerary.findById(publicItineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Update the user document to add to savedItineraries only if not already saved
    const user = await User.findById(userId);

    if (user.itineraries.includes(publicItineraryId)) {
      return res.status(400).json({ message: "Itinerary already saved" });
    }

    user.itineraries.push(publicItineraryId);
    await user.save();

    res.status(200).json({ message: "Itinerary saved successfully" });
  } catch (error) {
    console.error("saveItinerary error:", error);
    res.status(500).json({ message: "Server error while saving itinerary" });
  }
};

// Fetch saved itineraries for logged-in user
const getSavedItineraries = async (req, res) => {
  try {
    const userId = req.userID;

    // Populate itineraries from user's saved list
    const user = await User.findById(userId).populate('itineraries');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.itineraries);
  } catch (error) {
    console.error('getSavedItineraries error:', error);
    res.status(500).json({ message: 'Failed to fetch saved itineraries' });
  }
};

const getRecommendedItineraries = async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const objectId = new mongoose.Types.ObjectId(itineraryId);

    const current = await Itinerary.findById(itineraryId); // <-- DO THIS
    if (!current || !current.featureVector) {
      return res.status(404).json({
        error: 'Itinerary not found or has no feature vector',
      });

    }

    const allItineraries = await Itinerary.find({
      _id: { $ne: objectId },
      isPublic: true,
      featureVector: { $exists: true }
    });

    const similarities = allItineraries.map(it => {
      return {
        itinerary: it,
        similarity: cosineSimilarity(current.featureVector, it.featureVector)
      };
    });

    similarities.sort((a, b) => b.similarity - a.similarity);

    const topItineraries = similarities.slice(0, req.query.topN || 5).map(i => i.itinerary);

    res.status(200).json(topItineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

const getItineraryRecommendationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(userObjectId).populate("itineraries");

    if (!user || !user.itineraries || user.itineraries.length === 0) {
      return res.status(404).json({ error: 'No saved itineraries found for user' });
    }

    const savedItineraries = user.itineraries.filter(it => Array.isArray(it.featureVector) && it.featureVector.length > 0);

    if (!savedItineraries.length) {
      return res.status(404).json({ error: 'No saved itineraries with feature vectors found for user' });
    }

    const avgVector = savedItineraries[0].featureVector.map((_, i) =>
      savedItineraries.reduce((sum, it) => sum + it.featureVector[i], 0) / savedItineraries.length
    );

    const allItineraries = await Itinerary.find({
      owner: { $ne: userObjectId },
      isPublic: true,
      featureVector: { $exists: true }
    });

    const recommendations = allItineraries.map(it => ({
      itinerary: it,
      similarity: cosineSimilarity(avgVector, it.featureVector)
    }));

    recommendations.sort((a, b) => b.similarity - a.similarity);

    const topItineraries = recommendations
      .slice(0, parseInt(req.query.topN) || 5)
      .map(i => i.itinerary);

    res.status(200).json({ topItineraries });

  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: 'Failed to get user recommendations', details: err.message });
  }
};

module.exports = {updateItinerary,createItinerary,deleteItinerary,getAllItineraries,getItineraryById,getFilteredItineraries,saveItinerary,getSavedItineraries,getCityItineraries,getRecommendedItineraries,getItineraryRecommendationsForUser}