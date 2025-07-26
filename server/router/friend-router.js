const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const friendController = require('../controllers/friend-controller');

router.post('/send', authMiddleware, friendController.sendFriendRequest);
router.post('/accept', authMiddleware, friendController.acceptFriendRequest);
router.post('/reject', authMiddleware, friendController.rejectFriendRequest);
router.get('/list', authMiddleware, friendController.getFriends);

module.exports = router;
