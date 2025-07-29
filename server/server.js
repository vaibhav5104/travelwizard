const express = require('express');
const cors = require("cors");
const app = express();
const connectDB = require('./utils/db');
const PORT = process.env.PORT || 3000;
const authRoute = require("./router/auth-router");
const cityRoute = require("./router/city-router");
const adminRoute = require("./router/admin-router");
const hotelRouter = require("./router/hotel-router");
const placeRouter = require("./router/place-router");
const itineraryRoutes = require('./router/itinerary-router');
const friendRoutes = require('./router/friend-router');

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
};
console.log("Frontend env is : ",process.env.FRONTEND_URL)

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handles preflight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/tour", cityRoute);
app.use("/api/admin", adminRoute);
app.use("/api", hotelRouter);
app.use("/api/place", placeRouter);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/friends', friendRoutes);

// ✅ Ping route to prevent cold starts
app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT ${PORT}`);
    });
});
