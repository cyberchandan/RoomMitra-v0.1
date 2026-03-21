const Room = require('../models/Room');

// @desc    Fetch all rooms (with filters and pagination)
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const listingFilter = req.query.listingType 
    ? { listingType: req.query.listingType } 
    : {};

  const locationFilter = req.query.location 
    ? { location: { $regex: req.query.location, $options: 'i' } } 
    : {};

  const query = { ...keyword, ...listingFilter, ...locationFilter };

  try {
    const count = await Room.countDocuments(query);
    const rooms = await Room.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ rooms, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('ownerId', 'name email');
    if (room) {
      // Hide contact number if User is not logged in? 
      // Handled in frontend or we can omit it here if we attach protect middleware conditionally.
      // For simplicity, returning all details.
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Owner
const createRoom = async (req, res) => {
  const {
    title, price, location, description, contactNumber, images,
    listingType, occupants, preferredGender, rentSplit, lifestyle
  } = req.body;

  try {
    const room = new Room({
      title,
      price,
      location,
      description,
      contactNumber,
      images,
      listingType,
      occupants,
      preferredGender,
      rentSplit,
      lifestyle,
      ownerId: req.user._id,
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Owner
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room && room.ownerId.toString() === req.user._id.toString()) {
      room.title = req.body.title || room.title;
      room.price = req.body.price || room.price;
      room.location = req.body.location || room.location;
      room.description = req.body.description || room.description;
      room.contactNumber = req.body.contactNumber || room.contactNumber;
      room.images = req.body.images || room.images;
      room.listingType = req.body.listingType || room.listingType;
      
      room.occupants = req.body.occupants !== undefined ? req.body.occupants : room.occupants;
      room.preferredGender = req.body.preferredGender || room.preferredGender;
      room.rentSplit = req.body.rentSplit !== undefined ? req.body.rentSplit : room.rentSplit;
      room.lifestyle = req.body.lifestyle || room.lifestyle;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Owner
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room && room.ownerId.toString() === req.user._id.toString()) {
      await room.deleteOne();
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
