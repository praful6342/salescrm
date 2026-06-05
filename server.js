require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Import controller
const clientController = require('./controllers/clientController');

const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('DB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Routes
app.get('/dashboard', clientController.dashboard);
app.use('/clients', require('./routes/clientRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));  // Activity API routes

// Root redirects to dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));