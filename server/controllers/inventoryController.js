const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');

// @desc    Get all transactions
// @route   GET /api/inventory
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    // Build query
    let query = {};

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by warehouse
    if (req.query.warehouse) {
      query.$or = [
        { warehouse: req.query.warehouse },
        { fromWarehouse: req.query.warehouse },
        { toWarehouse: req.query.warehouse }
      ];
    }

    // Execute query
    const transactions = await Transaction.find(query)
      .populate('product', 'name sku')
      .populate('warehouse', 'name')
      .populate('fromWarehouse', 'name')
      .populate('toWarehouse', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/inventory/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name sku')
      .populate('warehouse', 'name')
      .populate('fromWarehouse', 'name')
      .populate('toWarehouse', 'name')
      .populate('createdBy', 'name');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new receipt (incoming stock)
// @route   POST /api/inventory/receipt
// @access  Private
exports.createReceipt = async (req, res) => {
  try {
    const { product, quantity, warehouse, reference, notes } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if warehouse exists
    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Create receipt
    const receipt = await Transaction.create({
      type: 'receipt',
      reference,
      product,
      quantity,
      warehouse,
      notes,
      createdBy: req.user.id,
      status: 'done',
    });

    // Populate response
    const populatedReceipt = await Transaction.findById(receipt._id)
      .populate('product', 'name sku')
      .populate('warehouse', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedReceipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new delivery (outgoing stock)
// @route   POST /api/inventory/delivery
// @access  Private
exports.createDelivery = async (req, res) => {
  try {
    const { product, quantity, warehouse, reference, notes } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if warehouse exists
    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Create delivery
    const delivery = await Transaction.create({
      type: 'delivery',
      reference,
      product,
      quantity,
      warehouse,
      notes,
      createdBy: req.user.id,
      status: 'done',
    });

    // Populate response
    const populatedDelivery = await Transaction.findById(delivery._id)
      .populate('product', 'name sku')
      .populate('warehouse', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedDelivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new internal transfer
// @route   POST /api/inventory/transfer
// @access  Private
exports.createTransfer = async (req, res) => {
  try {
    const { product, quantity, fromWarehouse, toWarehouse, reference, notes } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if warehouses exist
    const fromWarehouseExists = await Warehouse.findById(fromWarehouse);
    if (!fromWarehouseExists) {
      return res.status(404).json({
        success: false,
        message: 'Source warehouse not found',
      });
    }

    const toWarehouseExists = await Warehouse.findById(toWarehouse);
    if (!toWarehouseExists) {
      return res.status(404).json({
        success: false,
        message: 'Destination warehouse not found',
      });
    }

    // Create transfer
    const transfer = await Transaction.create({
      type: 'transfer',
      reference,
      product,
      quantity,
      fromWarehouse,
      toWarehouse,
      notes,
      createdBy: req.user.id,
      status: 'done',
    });

    // Populate response
    const populatedTransfer = await Transaction.findById(transfer._id)
      .populate('product', 'name sku')
      .populate('fromWarehouse', 'name')
      .populate('toWarehouse', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedTransfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new stock adjustment
// @route   POST /api/inventory/adjustment
// @access  Private
exports.createAdjustment = async (req, res) => {
  try {
    const { product, quantity, warehouse, reference, notes } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if warehouse exists
    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Create adjustment
    const adjustment = await Transaction.create({
      type: 'adjustment',
      reference,
      product,
      quantity,
      warehouse,
      notes,
      createdBy: req.user.id,
      status: 'done',
    });

    // Populate response
    const populatedAdjustment = await Transaction.findById(adjustment._id)
      .populate('product', 'name sku')
      .populate('warehouse', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedAdjustment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get dashboard data
// @route   GET /api/inventory/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$reorderLevel', '$maxStock'] }
    }).countDocuments();

    // Get out of stock products
    const outOfStockProducts = await Product.find({
      $expr: { $eq: ['$reorderLevel', 0] }
    }).countDocuments();

    // Get pending receipts
    const pendingReceipts = await Transaction.find({
      type: 'receipt',
      status: { $in: ['draft', 'waiting', 'ready'] }
    }).countDocuments();

    // Get pending deliveries
    const pendingDeliveries = await Transaction.find({
      type: 'delivery',
      status: { $in: ['draft', 'waiting', 'ready'] }
    }).countDocuments();

    // Get scheduled transfers
    const scheduledTransfers = await Transaction.find({
      type: 'transfer',
      status: { $in: ['draft', 'waiting', 'ready'] }
    }).countDocuments();

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .populate('product', 'name sku')
      .populate('warehouse', 'name')
      .populate('fromWarehouse', 'name')
      .populate('toWarehouse', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers,
        recentTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all warehouses
// @route   GET /api/inventory/warehouses
// @access  Private
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new warehouse
// @route   POST /api/inventory/warehouses
// @access  Private
exports.createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};