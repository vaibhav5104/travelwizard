const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const Itenerary = require("../models/itinerary-model");
const mongoURI = process.env.URI;
const API=process.env.API
// MongoDB connection using createConnection
const conn = mongoose.createConnection(mongoURI);

let gridfsBucket;//gridfsBucket is an instance of GridFSBucket, a MongoDB utility that allows for storing and retrieving large files (like images) in MongoDB

conn.once("open", () => {
    gridfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    console.log("GridFS Bucket Ready in itenirary-controller");
});

// Multer configuration
const imageUpload = multer({
    storage: multer.memoryStorage(),//memoryStorage() keeps the files in RAM as buffers.
}).fields([
    { name: "placeImages", maxCount: 10 },
    { name: "hotelImages", maxCount: 10 },
    { name: "transportationImages", maxCount: 10 },
]);

const multipleFileUpload = (req, res, next) => {//Error Handling
    imageUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }
        next();
    });
};

// Add itinerary function
const addItenerary = async (req, res) => {
    try {
        console.log("req.body is : ",req.body);
        const { name, budget, days } = req.body;

        const places = {
            placeImage: [],
            placeName: req.body.placeName || [],
            placePrice: req.body.placePrice || [],
            placeLink: req.body.placeLink || []
        };
        const hotels = {
            hotelImage: [],
            hotelName: req.body.hotelName || [],
            hotelPrice: req.body.hotelPrice || [],
            hotelLink: req.body.hotelLink || []

        };
        const transportation = {
            transportationImage: [],
            transportationName: req.body.transportationName || [],
            transportationPrice: req.body.transportationPrice || [],
            transportationLink: req.body.transportationLink || []
        };

        // fs.files: Stores file metadata (filename, upload date, content type, etc.).
        // fs.chunks: Stores the actual binary file data in chunks.

        if (req.files && req.files.placeImages) {
            console.log("Uploaded placeImages Files:", req.files);
            for (const file of req.files.placeImages) {//contains an array of uploaded image files
                //Each file has properties like originalname (name of the file), mimetype (file type), and buffer (binary data of the file)
                // console.log(file.originalname);//name of image 

                // Creates a writable stream for GridFSBucket to upload the file
                const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype,
                });
                uploadStream.end(file.buffer);//Ends the writable stream by writing the file's binary data (file.buffer) into GridFS. This uploads the file to the database
                places.placeImage.push(uploadStream.id);//places.placeImage is an array in your database model where the IDs of the uploaded images will be stored
                // After uploading, uploadStream.id contains the ID of the stored file in GridFS. This ID is pushed into the hotels.hotelImage array, allowing the application to reference the uploaded file later (e.g., for displaying or downloading the image)
            }
        }

        if (req.files && req.files.hotelImages) {
            console.log("Uploaded hotelImages Files:", req.files);
            for (const file of req.files.hotelImages) {
                const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype,
                });
                uploadStream.end(file.buffer);
                hotels.hotelImage.push(uploadStream.id);
            }
        }

        if (req.files && req.files.transportationImages) {
            console.log("Uploaded transportationImages Files:", req.files);
            for (const file of req.files.transportationImages) {
                const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype,
                });
                uploadStream.end(file.buffer);
                transportation.transportationImage.push(uploadStream.id);
            }
        }
        const iteneraryExists = await Itenerary.findOne({
            name,
            budget,
            days,
        });

        if (iteneraryExists) {
            return res.status(400).json({
                message: "Itinerary for this city and given budget and days already exists.",
            });
        }

        const iteneraryData = {
            name,
            budget,
            days,
            places,
            hotels,
            transportation,
        };

        const iteneraryCreated = await Itenerary.create(iteneraryData);

        res.status(201).json({
            message: "Itinerary Created",
            itenerary: iteneraryCreated,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItenerary = async (req, res) => {
    try {
        const { budget, days } = req.query;
        const _name = req.params.name;

        if (!_name || !budget || !days) {
            return res.status(400).json({
                message: "Missing required parameters: name, budget, or days",
                budget,
                _name,
                days,
            });
        }

        const itineraries = await Itenerary.find({ name: _name });

        if (!itineraries || itineraries.length === 0) {
            return res.status(404).json({ message: "No itineraries found for the specified city" });
        }

        const rankedItineraries = itineraries.map((itinerary) => {
            const budgetScore = Math.abs(itinerary.budget - budget);
            const daysScore = Math.abs(itinerary.days - days);

            return {
                ...itinerary._doc,
                // itinerary is a Mongoose document with methods like save and update.
                // itinerary._doc contains the raw data as a plain JavaScript object.
                // When you spread ...itinerary._doc, you extract the raw data of the document and
                // include it in the new object being returned. This is useful for ensuring you're 
                // working with the plain object rather than the extended Mongoose document.
                score: budgetScore + daysScore,
                places: {
                    ...itinerary.places,
                    placeImage: itinerary.places.placeImage.map(
                        (id) => `${API}/api/tour/images/${id}`
                    ),   
                },
                hotels: {
                    ...itinerary.hotels,
                    hotelImage: itinerary.hotels.hotelImage.map(
                        (id) => `${API}/api/tour/images/${id}`
                    ),
                },
                transportation: {
                    ...itinerary.transportation,
                    transportationImage: itinerary.transportation.transportationImage.map(
                        (id) => `${API}/api/tour/images/${id}`
                    ),
                },
            };
        });

        rankedItineraries.sort((a, b) => a.score - b.score);

        res.status(200).json({
            itinerary: rankedItineraries[0], // Closest match
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItineraries =  async (req,res) => {

    try {
        const iteneraries = await Itenerary.find()

        if(iteneraries.length === 0) {
            return res.status(404).send({message: "There are no iteneraries"})
        }

        return res.status(201).json({iteneraries})
    } catch (error) {
        res.status(500).json({message :error.message })
    }

}

// Route to fetch images by their ID
const getImageById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Image ID is required" });
        }

        const objectId = new ObjectId(id);

        const file = await conn.db.collection("uploads.files").findOne({ _id: objectId });
        if (!file) {
            return res.status(404).json({ message: "Image not found" });
        }

        const readStream = gridfsBucket.openDownloadStream(objectId);
        res.set("Content-Type", file.contentType);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add these functions to your existing itinerary-controller.js file

// Update an itinerary by ID
const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, budget, days } = req.body;
        
        // Validation
        if (!id) {
            return res.status(400).json({ message: "Itinerary ID is required" });
        }

        // Find the itinerary
        const itinerary = await Itenerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        // Update the fields that are provided
        if (name) itinerary.name = name;
        if (budget) itinerary.budget = budget;
        if (days) itinerary.days = days;

        // Save the updated itinerary
        await itinerary.save();

        res.status(200).json({
            message: "Itinerary updated successfully",
            itinerary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// // Delete an itinerary by ID
// const deleteItinerary = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         // Validation
//         if (!id) {
//             return res.status(400).json({ message: "Itinerary ID is required" });
//         }

//         // Find and delete the itinerary
//         const deletedItinerary = await Itenerary.findByIdAndDelete(id);
        
//         if (!deletedItinerary) {
//             return res.status(404).json({ message: "Itinerary not found" });
//         }

//         // Update the itinerary count in the City model
//         const cityName = deletedItinerary.name;
//         await updateItineraryCount(cityName);

//         res.status(200).json({
//             message: "Itinerary deleted successfully",
//             itinerary: deletedItinerary
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validation
        if (!id) {
            return res.status(400).json({ message: "Itinerary ID is required" });
        }

        // Find the itinerary to get image IDs before deletion
        const itinerary = await Itenerary.findById(id);
        
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }

        // Collect all image IDs
        const imageIds = [
            ...itinerary.places.placeImage,
            ...itinerary.hotels.hotelImage,
            ...itinerary.transportation.transportationImage
        ];

        // Delete the itinerary document
        await Itenerary.findByIdAndDelete(id);

        // Delete all associated images from GridFS
        for (const imageIdStr of imageIds) {
            try {
                const imageId = new ObjectId(imageIdStr);
                
                // Delete all chunks and file metadata from GridFS
                await gridfsBucket.delete(imageId);
                
                console.log(`Successfully deleted image: ${imageIdStr}`);
            } catch (imgErr) {
                console.error(`Error deleting image ${imageIdStr}:`, imgErr);
                // Continue with other deletions even if one fails
            }
        }

        // Update the itinerary count in the City model
        const cityName = itinerary.name;
        await updateItineraryCount(cityName);

        res.status(200).json({
            message: "Itinerary and all associated images deleted successfully",
            itineraryId: id,
            deletedImagesCount: imageIds.length
        });
    } catch (error) {
        console.error("Error in deleteItinerary:", error);
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update itinerary count (copied from model for use in controller)
async function updateItineraryCount(cityName) {
    const count = await Itenerary.countDocuments({ name: cityName });
    await mongoose.model('City').findOneAndUpdate(
        { name: cityName },
        { itineraryCount: count },
        { new: true }
    );
}

// Export the new functions along with existing ones
module.exports = {
    addItenerary,
    getItenerary,
    getItineraries,
    updateItinerary,
    deleteItinerary,
    getImageById,
    imageUpload,
    multipleFileUpload
};
// Using Multer with GridFS allows direct streaming of uploaded files into MongoDB without saving them on disk.


/* 

GridFS and Multer Explained
1. What is GridFS?
    GridFS is a MongoDB specification for storing and retrieving large files (such as images, videos, and PDFs) that exceed MongoDB's BSON document size limit (16MB). Instead of storing the file in a single document, GridFS splits the file into smaller chunks (default: 255KB each) and stores them across multiple documents in two collections:
    
    fs.files: Stores file metadata (filename, upload date, content type, etc.).
    fs.chunks: Stores the actual binary file data in chunks.
    This allows MongoDB to handle large files efficiently.

2. What is Multer?
    Multer is a Node.js middleware for handling file uploads. It processes multipart/form-data, a common format used for uploading files via HTML forms.

    It provides different storage options:

    MemoryStorage: Stores files in RAM (as buffers).
    DiskStorage: Saves files to a directory on the server.
3. How Does GridFS Work?
    When a file is uploaded using GridFS, it follows these steps:

    Splitting the File: The file is broken into smaller chunks (default: 255KB).
    Storing Metadata: A record is created in the fs.files collection with details like filename and size.
    Saving Chunks: Each chunk is stored as a document in fs.chunks, referencing the main file record.
    Retrieving Files: When needed, GridFS reassembles the chunks in order and streams them back.
4. Why is Multer Used with GridFS?
    Multer is used because:

    It handles file uploads from the client-side.
    It can store files in memory (RAM), which allows direct streaming into GridFS instead of saving them on disk.
    It ensures that multipart/form-data is properly parsed.

    memoryStorage() keeps the files in RAM as buffers.
    req.files contains the uploaded files.
    These files are then streamed into GridFS via:
        const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        });
        uploadStream.end(file.buffer);
    This uploads the file directly to MongoDB instead of saving it on the server’s filesystem.

5. Summary
    GridFS stores large files in MongoDB efficiently by splitting them into chunks.
    Multer handles file uploads and prepares them for storage.
    Using Multer with GridFS allows direct streaming of uploaded files into MongoDB without saving them on disk.
    This approach is useful for cloud-based applications where you don’t want to store files on the local server. 🚀



*/