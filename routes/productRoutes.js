const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Fetch all products
router.get('/', productController.getAllProducts);

// POST /api/products - Add a new product
router.post('/', productController.addProduct);

// DELETE /api/products/:id - Delete a product (optional - for future use)
router.delete('/:id', productController.deleteProduct);

module.exports = router;