const express = require('express')
const router = express.Router()
const hotelController = require("../controllers/hotel-controller")
const adminMiddleware = require('../middlewares/admin-middleware')
const authMiddleware = require('../middlewares/auth-middleware')

router 
    .route("/city-hotels")
    .get(hotelController.getAllCities)

router 
    .route("/city-hotels")
    .post(authMiddleware, adminMiddleware, hotelController.addCityWithHotels)

router 
    .route("/city-hotels/:city")
    .get(hotelController.getHotelsByCity)

router 
    .route("/city-hotels/update")
    .put(authMiddleware, adminMiddleware, hotelController.updateHotelCoordinates)

module.exports = router