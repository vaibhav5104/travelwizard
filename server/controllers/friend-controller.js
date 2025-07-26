const User = require('../models/user-model');

// Send a friend request
const sendFriendRequest = async (req, res) => {
  console.log("Conrtoller : ",sendFriendRequest);
  const senderId = req.userID;
  const { recipientId } = req.body;

  if (senderId === recipientId) {
    return res.status(400).json({ message: "You cannot send a request to yourself." });
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) return res.status(404).json({ message: "Recipient not found" });

  const alreadySent = recipient.friendRequests.find(req => req.from.toString() === senderId);
  if (alreadySent) return res.status(400).json({ message: "Friend request already sent." });

  recipient.friendRequests.push({ from: senderId });
  await recipient.save();

  res.status(200).json({ message: "Friend request sent." });
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  const userId = req.userID;
  const { requesterId } = req.body;

  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);

  if (!requester) return res.status(404).json({ message: "Requester not found" });

  // Update both users’ friends
  user.friends.push(requesterId);
  requester.friends.push(userId);

  // Remove request
  user.friendRequests = user.friendRequests.filter(
    req => req.from.toString() !== requesterId
  );

  await user.save();
  await requester.save();

  res.status(200).json({ message: "Friend request accepted" });
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  const userId = req.userID;
  const { requesterId } = req.body;

  const user = await User.findById(userId);
  user.friendRequests = user.friendRequests.filter(
    req => req.from.toString() !== requesterId
  );

  await user.save();
  res.status(200).json({ message: "Friend request rejected" });
};

// Get friends list
const getFriends = async (req, res) => {
  const userId = req.userID;
  const user = await User.findById(userId).populate('friends', 'username email');
  res.status(200).json(user.friends);
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends
};
