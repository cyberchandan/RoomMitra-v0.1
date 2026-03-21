const express = require('express');
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, owner } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, owner, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, owner, updateRoom)
  .delete(protect, owner, deleteRoom);

module.exports = router;
