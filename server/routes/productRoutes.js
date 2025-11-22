const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Product routes
router
  .route('/')
  .get(protect, getProducts)
  .post(
    protect,
    [
      body('name').notEmpty().withMessage('Product name is required'),
      body('sku').notEmpty().withMessage('SKU is required'),
      body('category').notEmpty().withMessage('Category is required'),
      body('unitOfMeasure').notEmpty().withMessage('Unit of measure is required'),
    ],
    handleValidationErrors,
    createProduct
  );

router
  .route('/:id')
  .get(protect, getProduct)
  .put(
    protect,
    [
      body('name').optional().notEmpty().withMessage('Product name is required'),
      body('sku').optional().notEmpty().withMessage('SKU is required'),
      body('category').optional().notEmpty().withMessage('Category is required'),
      body('unitOfMeasure')
        .optional()
        .notEmpty()
        .withMessage('Unit of measure is required'),
    ],
    handleValidationErrors,
    updateProduct
  )
  .delete(protect, deleteProduct);

// Category routes
router
  .route('/categories')
  .get(protect, getCategories)
  .post(
    protect,
    [body('name').notEmpty().withMessage('Category name is required')],
    handleValidationErrors,
    createCategory
  );

module.exports = router;