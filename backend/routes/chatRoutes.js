const express = require('express');
const { getChatHistory, saveMessage, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, saveMessage);
  
router.route('/conversations/all')
  .get(protect, getConversations);

router.route('/:userId')
  .get(protect, getChatHistory);

module.exports = router;
