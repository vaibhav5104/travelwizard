const express = require("express");
const router = express.Router();
const cityPlacesController = require("../controllers/place-controller");

// Routes
router.get("/", cityPlacesController.getAllCities);
router.get("/:name", cityPlacesController.getCityByName);

module.exports = router;
