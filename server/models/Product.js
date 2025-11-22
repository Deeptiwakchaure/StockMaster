const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU'],
    unique: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify a category'],
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Please specify a unit of measure'],
  },
  reorderLevel: {
    type: Number,
    default: 0,
  },
  maxStock: {
    type: Number,
    default: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);