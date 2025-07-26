const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    // Cloned or created itineraries unique to the user
    itineraries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary'
    }],

    friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }],

    friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    _id: false // prevents Mongoose from generating an extra _id for each subdocument
    }]
})

// Password hash logic (unchanged)
userSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    try {
        const saltRound = await bcrypt.genSalt(10)
        const hash_password = await bcrypt.hash(user.password, saltRound)
        user.password = hash_password
        next()
    } catch (error) {
        next(error)
    }
})

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

// Generate JWT token
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d"
            }
        )
    } catch (error) {
        console.log("generateToken().error : ", error)
        throw new Error("Token generation error: " + error.message)
    }
}

const User = mongoose.model("User", userSchema)
module.exports = User
