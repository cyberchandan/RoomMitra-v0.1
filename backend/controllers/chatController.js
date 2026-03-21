const Message = require('../models/Message');

// @desc    Get chat history between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Oldest to newest

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a chat message to the DB using REST
// @route   POST /api/chat
// @access  Private
const saveMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    
    const message = new Message({
      sender: req.user._id,
      receiver,
      content
    });

    const savedMessage = await message.save();
    
    // Also emit using socket attached to req by middleware if needed,
    // though usually handled directly via socket handler.
    // req.io.to(receiver).emit('receive_message', savedMessage);

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active conversations for current user
// @route   GET /api/chat/conversations/all
// @access  Private
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Retrieve all messages involving the current user, sort by latest finding distinct conversations
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      // Identify the other user in the conversation
      const isSender = msg.sender._id.toString() === currentUserId.toString();
      const otherUser = isSender ? msg.receiver : msg.sender;

      // To handle edge cases where users might be deleted
      if (!otherUser) return;

      if (!conversationsMap.has(otherUser._id.toString())) {
        conversationsMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          unread: !isSender && !msg.readStatus // If we are not the sender and it's not read
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChatHistory, saveMessage, getConversations };
