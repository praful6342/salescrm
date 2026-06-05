const Product = require('../models/Product');

// Get all products (sorted alphabetically)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Product name is required' });
    }
    
    const trimmedName = name.trim();
    
    // Check if product already exists
    const existingProduct = await Product.findOne({ name: trimmedName });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product already exists' });
    }
    
    // Create new product
    const newProduct = new Product({
      name: trimmedName
    });
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Delete a product (optional - for future use)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};