const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth-controller')
const authMiddleware = require('../middlewares/auth-middleware')

router
    .route("/register")
    .post(authControllers.register)

router
    .route("/login")
    .post(authControllers.login)

router
    .route("/user")
    .get(authMiddleware,authControllers.user)

router
    .route("/users")
    .get(authMiddleware,authControllers.allUsers)

router
    .route("/users/:username")
    .get(authControllers.userByName)

// routes/authRoute.js
router
  .route("/google-login")
  .post(authControllers.googleLogin);


router
    .route("/user/:id")
    .get(authControllers.userById)
    
router
    .route("/users/:id")
    .put(authMiddleware,authControllers.updateUser)

router
    .route("/users/:id")
    .delete(authMiddleware,authControllers.deleteUser)

router
    .route("/sendmail")
    .post(authControllers.contact)

module.exports = router