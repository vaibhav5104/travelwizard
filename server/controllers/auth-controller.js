const User = require('../models/user-model')
// const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

// controllers/auth-controller.js
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    // const user : req.body.name,
    service: 'gmail',
    auth: {
      user: 'vaibhavsharma5104@gmail.com',
      pass: 'zjhi dvqe usfu lgbw', // Use environment variables for production
    },
  });

  // Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
      console.error('Error in Nodemailer transporter:', error);
    } else {
      console.log('Nodemailer is ready to send emails:', success);
    }
  })

const register = async (req,res) => {

    try {
        const {username,email,phone,password} = req.body
        const userExist = await User.findOne({email})

        if(userExist){
            return res.status(400).json({message : "User already exist"})
        }

        const userCreated = await User.create({username,email,phone,password})
        res
        .status(201)
        .json({
            message: "User Registration successful",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString()
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const login = async (req,res) => {

    try {
        const {email,password} = req.body
        const userExist = await User.findOne({email})
        if(!userExist) return res.status(400).json({message : "User doesnot exist"})
        const user = await userExist.comparePassword(password)
    
        if(user){
            res
            .status(200)
            .json({
                message: "Login successful",
                token: await userExist.generateToken(),
                userId:userExist._id.toString(),
            })
        }else{
            res.status(401).json({
                message : "Invalid Credentials",
            })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const user = async (req, res) => {
  const userId = req.userID;
  const user = await User.findById(userId)
    .populate('friendRequests.from', 'username') // populate requester username
    .lean();

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    userData: {
      _id : user._id,
      username: user.username,
      email : user.email,
      phone : user.phone,
      itineraries : user.itineraries,
      friends : user.friends,
      isAdmin : user.isAdmin,
      friendRequests: user.friendRequests.map(req => ({
        from: req.from._id,
        fromUsername: req.from.username
      }))
    }
  });
};

const userById = async (req,res) => {

  const userId = req.params.id;
  const user = await User.findById(userId);


  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    userData: {
      _id : user._id,
      username: user.username,
      email : user.email,
      phone : user.phone,
      itineraries : user.itineraries,
      friends : user.friends,
      isAdmin : user.isAdmin,
      friendRequests: user.friendRequests.map(req => ({
        from: req.from._id,
        fromUsername: req.from.username
      }))
    }
  });

}

const userByName = async (req,res) => {

  try {
    
    const username = req.params.username;

    const userProfile = await User.findOne({username})
    return res.status(200).json({userProfile})
  } catch (error) {
    console.log(` error from user route ${error}`);
  }

}

const allUsers = async (req,res) => {

    try {
        // const userData = await User.find({});
        // const userData = req.user;
        const userData = await User.find({}, {password:0})
  
      //   console.log(userData);
        return res.status(200).json({ userData });
      } catch (error) {
        console.log(` error from user route ${error}`);
      }
}


const googleLogin = async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name, sub } = payload;

        let user = await User.findOne({ email });

        const baseUsername = name.replace(/\s+/g, '').toLowerCase(); // "John Doe" -> "johndoe"
        const uniqueUsername = baseUsername + Date.now(); // "johndoe1672342446"


        if (!user) {
            try {
                user = await User.create({
                    username: uniqueUsername,
                    email,
                    phone: 1234567890, // placeholder
                    password: sub // using Google's sub as temp password
                });
            } catch (err) {
                console.error("Error creating user:", err);
                return res.status(500).json({ error: "Failed to create user", details: err.message });
            }
        }

        const token = await user.generateToken();
        res.status(200).json({
            message: "Google login successful",
            token,
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({ error: "Google authentication failed", details: error.message });
    }
};


const contact = async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      console.log("Received form data:", { name, email, message });
  
      const mailOptions = {
        from: email,
        to: 'vaibhavsharma5104@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `Message from: ${name} (${email})\n\n${message}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error in sending email:", error); // Log the actual error
          return res.status(500).json({ message: 'Something went wrong', error });
        }
        console.log("Message sent successfully:", info); // Log the info on success
        res.status(200).json({ message: 'Message sent successfully!' });
      });
    } catch (error) {
      console.error("Caught error:", error); // Log the error from the catch block
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

// Update User
const updateUser = async (req, res) => {
  try {
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {register,login,user,contact,allUsers,updateUser, deleteUser,userByName,userById,googleLogin}