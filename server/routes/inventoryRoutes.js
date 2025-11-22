const express = require('express');
const {
  getTransactions,
  getTransaction,
  createReceipt,
  createDelivery,
  createTransfer,
  createAdjustment,
  getDashboardData,
  getWarehouses,
  createWarehouse,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Transaction routes
router.route('/').get(protect, getTransactions);
router.route('/dashboard').get(protect, getDashboardData);
router.route('/:id').get(protect, getTransaction);

// Receipt routes
router.post(
  '/receipt',
  protect,
  [
    body('product').notEmpty().withMessage('Product is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('warehouse').notEmpty().withMessage('Warehouse is required'),
    body('reference').notEmpty().withMessage('Reference is required'),
  ],
  handleValidationErrors,
  createReceipt
);

// Delivery routes
router.post(
  '/delivery',
  protect,
  [
    body('product').notEmpty().withMessage('Product is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('warehouse').notEmpty().withMessage('Warehouse is required'),
    body('reference').notEmpty().withMessage('Reference is required'),
  ],
  handleValidationErrors,
  createDelivery
);

// Transfer routes
router.post(
  '/transfer',
  protect,
  [
    body('product').notEmpty().withMessage('Product is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('fromWarehouse').notEmpty().withMessage('Source warehouse is required'),
    body('toWarehouse').notEmpty().withMessage('Destination warehouse is required'),
    body('reference').notEmpty().withMessage('Reference is required'),
  ],
  handleValidationErrors,
  createTransfer
);

// Adjustment routes
router.post(
  '/adjustment',
  protect,
  [
    body('product').notEmpty().withMessage('Product is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('warehouse').notEmpty().withMessage('Warehouse is required'),
    body('reference').notEmpty().withMessage('Reference is required'),
  ],
  handleValidationErrors,
  createAdjustment
);

// Warehouse routes
router
  .route('/warehouses')
  .get(protect, getWarehouses)
  .post(
    protect,
    [
      body('name').notEmpty().withMessage('Warehouse name is required'),
      body('location').notEmpty().withMessage('Location is required'),
    ],
    handleValidationErrors,
    createWarehouse
  );

module.exports = router;