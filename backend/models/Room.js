const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  contactNumber: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // New Feature: Room Partner System
  listingType: { type: String, enum: ['full_room', 'room_partner'], required: true },
  
  // Fields specific to room_partner
  occupants: { type: Number, default: 0 },
  preferredGender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  rentSplit: { type: Number, default: 0 },
  lifestyle: { type: String } // optional: e.g., 'student', 'job', 'non-smoking'
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
