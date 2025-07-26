const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itenerary-controller');
const authMiddleware = require("../middlewares/auth-middleware")

// CRUD endpoints
router.post('/',authMiddleware, itineraryController.createItinerary);
router.post('/clone',authMiddleware, itineraryController.saveItinerary);
router.get('/clone', authMiddleware, itineraryController.getSavedItineraries);
router.get('/', itineraryController.getAllItineraries);
router.get('/filter', itineraryController.getFilteredItineraries);
router.get('/:id', itineraryController.getItineraryById);
router.get('/city/:city', itineraryController.getCityItineraries);
router.put('/:id', itineraryController.updateItinerary);
router.delete('/:id', itineraryController.deleteItinerary);
router.get('/:itineraryId/recommendations',itineraryController.getRecommendedItineraries)
router.get('/user/:userId/recommendations',itineraryController.getItineraryRecommendationsForUser)

module.exports = router;
