const express = require('express')
const router = express.Router()
const cityController = require('../controllers/city-controller')
// const iteneraryController = require('../controllers/itenerary-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')

router
    .route("/add/city")
    // .post(authMiddleware,adminMiddleware,cityController.multipleFileUpload,cityController.addCity)
    .post(authMiddleware,adminMiddleware,cityController.addCity)


// router
    // .route("/city/:name/budget")
    // .post(authMiddleware,adminMiddleware,iteneraryController.multipleFileUpload,iteneraryController.addItenerary)





module.exports = router