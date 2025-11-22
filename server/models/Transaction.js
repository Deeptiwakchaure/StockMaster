const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
    required: [true, 'Please specify transaction type'],
  },
  reference: {
    type: String,
    required: [true, 'Please add a reference number'],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please specify a product'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
  },
  fromWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
  },
  toWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'canceled'],
    default: 'draft',
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);