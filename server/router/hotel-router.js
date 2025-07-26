const express = require('express')
const router = express.Router()
const hotelController = require("../controllers/hotel-controller")

router 
    .route("/city-hotels")
    .get(hotelController.getAllCities)

router 
    .route("/city-hotels")
    .post(hotelController.addCityWithHotels)

router 
    .route("/city-hotels/:city")
    .get(hotelController.getHotelsByCity)

router 
    .route("/city-hotels/update")
    .put(hotelController.updateHotelCoordinates)

module.exports = router