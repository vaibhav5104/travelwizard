// const mongoose = require("mongoose");
// const { GridFSBucket } = require("mongodb");
// const City = require("../models/city-model");
// const multer = require("multer");
// const mongoURI = process.env.URI;
// const API = process.env.API;

// // MongoDB connection
// const conn = mongoose.createConnection(mongoURI);
// let gridfsBucket;

// conn.once("open", () => {
//     gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
//     console.log("GridFS Bucket Ready in city-controller");
// });

// // Multer configuration (memory storage for processing files)
// const imageUpload = multer({
//     storage: multer.memoryStorage(),
// }).fields([
//     // { name: "eventImages", maxCount: 10 }, // Expecting event image URLs, not files
//     { name: "cityImages", maxCount: 10 },  // City images use GridFS
// ]);

// const multipleFileUpload = (req, res, next) => {
//     imageUpload(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             return res.status(400).json({ message: err.message });
//         } else if (err) {
//             return res.status(500).json({ message: "File upload failed", error: err });
//         }
//         next();
//     });
// };

// // Add City
// const addCity = async (req, res) => {
//     try {
//         const {
//             name, blog, mapUrl, itineraryCount, rating, ideal_time, best_time_to_visit, state, country, /* eventImageUrls */
//         } = req.body;

//         if (!name || !blog || !rating || !ideal_time || !best_time_to_visit || !state || !country) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         const cityImage = [];

//         // Process city images (store in GridFS)
//         if (req.files.cityImages) {
//             for (const file of req.files.cityImages) {
//                 const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
//                     contentType: file.mimetype,
//                 });
//                 uploadStream.end(file.buffer);
//                 cityImage.push(uploadStream.id); // Store city image IDs in GridFS
//             }
//         }

//         const cityExist = await City.findOne({ name: name.toLowerCase() });
//         if (cityExist) {
//             return res.status(400).json({ message: "City already exists" });
//         }

//         const cityData = {
//             name: name.toLowerCase(),
//             cityImage,
//             // events,
//             blog,
//             mapUrl,
//             itineraryCount: itineraryCount || 0,
//             rating,
//             ideal_time,
//             best_time_to_visit,
//             state,
//             country,
//         };

//         const cityCreated = await City.create(cityData);

//         res.status(201).json({
//             message: "City created successfully",
//             city: cityCreated,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get City by Name
// const getCityByName = async (req, res) => {
//     try {
//         const _name = req.params.name;
//         const cityData = await City.findOne({ name: _name });

//         if (!cityData) {
//             return res.status(404).json({ message: `No data found for city: ${_name}` });
//         }

//         // Convert city image IDs to URLs (events already store URLs)
//         const cityImageUrls = cityData.cityImage.map(
//             (id) => `${API}/api/tour/images/${id}`
//         );

//         const formattedCityData = {
//             ...cityData._doc,
//             cityImage: cityImageUrls,
//         };

//         return res.status(200).json({ city: formattedCityData });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get All Cities
// const getCity = async (req, res) => {
//     try {
//         const cities = await City.find().sort({ _id: 1 });
//         return res.status(200).json({ cities });
//     } catch (error) {
//         console.error(`Error from city route: ${error}`);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update City
// const updateCity = async (req, res) => {
//     try {
//         const { name, blog, mapUrl, itineraryCount, rating, ideal_time, best_time_to_visit, state, country /* eventImageUrls */ } = req.body;
//         const cityId = req.params.id;

//         const city = await City.findById(cityId);
//         if (!city) {
//             return res.status(404).json({ message: "City not found" });
//         }

//         city.name = name || city.name;
//         city.blog = blog || city.blog;
//         city.mapUrl = mapUrl || city.mapUrl;
//         city.itineraryCount = itineraryCount ?? city.itineraryCount;
//         city.rating = rating ?? city.rating;
//         city.ideal_time = ideal_time || city.ideal_time;
//         city.best_time_to_visit = best_time_to_visit || city.best_time_to_visit;
//         city.state = state || city.state;
//         city.country = country || city.country;

//         await city.save();

//         res.status(200).json({ message: "City updated successfully", city });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete City
// const deleteCity = async (req, res) => {
//     try {
//         const cityId = req.params.id;

//         const city = await City.findByIdAndDelete(cityId);
//         if (!city) {
//             return res.status(404).json({ message: "City not found" });
//         }

//         res.status(200).json({ message: "City deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = { addCity, getCity, getCityByName, deleteCity, updateCity, imageUpload, multipleFileUpload };


const mongoose = require("mongoose");
const City = require("../models/city-model");
// const multer = require("multer");

// // Multer configuration (no file storage, just URL processing)
// const imageUpload = multer().none(); // No file processing, only text fields

// const multipleFileUpload = (req, res, next) => {
//     imageUpload(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             return res.status(400).json({ message: err.message });
//         } else if (err) {
//             return res.status(500).json({ message: "File upload failed", error: err });
//         }
//         next();
//     });
// };

// Add City
const addCity = async (req, res) => {
    try {
        const {
            name,
            blog,
            mapUrl,
            itineraryCount,
            rating,
            ideal_time,
            best_time_to_visit,
            state,
            country,
            cityImage,
        } = req.body;

        // Validate required fields
        if (!name || !blog || !rating || !ideal_time || !best_time_to_visit || !state || !country) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if city already exists
        const cityExist = await City.findOne({ name });
        if (cityExist) {
            return res.status(400).json({ message: "City already exists" });
        }

        if (!Array.isArray(cityImage) || cityImage.length === 0) {
    return res.status(400).json({ message: "cityImage must be a non-empty array" });
}


        const cityData = {
    name: name.toLowerCase(),
    cityImage: Array.isArray(cityImage) ? cityImage : [],
    blog,
    mapUrl,
    itineraryCount: itineraryCount ? Number(itineraryCount) : 0, // Convert to number
    rating: Number(rating), // Also ensure rating is a number
    ideal_time,
    best_time_to_visit,
    state,
    country,
};

        // Create city in DB
        const cityCreated = await City.create(cityData);

        res.status(201).json({
            message: "City created successfully",
            city: cityCreated,
        });
    } catch (error) {
        console.error("Error creating city:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get City by Name
const getCityByName = async (req, res) => {
    try {
        const _name = req.params.name;
        const cityData = await City.findOne({ name: _name });

        if (!cityData) {
            return res.status(404).json({ message: `No data found for city: ${_name}` });
        }

        return res.status(200).json({ city: cityData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Cities
const getCity = async (req, res) => {
    try {
        const cities = await City.find().sort({ _id: 1 });
        return res.status(200).json({ cities });
    } catch (error) {
        console.error(`Error from city route: ${error}`);
        res.status(500).json({ error: error.message });
    }
};

// Update City
const updateCity = async (req, res) => {
    try {
        const { name, blog, mapUrl, itineraryCount, rating, ideal_time, best_time_to_visit, state, country, cityImage } = req.body;
        const cityId = req.params.id;

        const city = await City.findById(cityId);
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        city.name = name || city.name;
        city.blog = blog || city.blog;
        city.mapUrl = mapUrl || city.mapUrl;
        city.itineraryCount = itineraryCount ?? city.itineraryCount;
        city.rating = rating ?? city.rating;
        city.ideal_time = ideal_time || city.ideal_time;
        city.best_time_to_visit = best_time_to_visit || city.best_time_to_visit;
        city.state = state || city.state;
        city.country = country || city.country;
        city.cityImage = cityImage ? JSON.parse(cityImage) : city.cityImage;

        await city.save();

        res.status(200).json({ message: "City updated successfully", city });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete City
const deleteCity = async (req, res) => {
    try {
        const cityId = req.params.id;

        const city = await City.findByIdAndDelete(cityId);
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }

        res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { addCity, getCity, getCityByName, deleteCity, updateCity /* imageUpload, multipleFileUpload */ };