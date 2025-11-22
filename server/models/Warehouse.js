const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a warehouse name'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Warehouse', warehouseSchema);