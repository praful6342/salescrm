const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true, 
    unique: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  interested: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  productService: { 
    type: String,
    // Only required if interested is true
    required: function() { return this.interested === true; }
  },
  expectedTimeline: { 
    type: Date,
    default: null
  },
  remarks: { 
    type: String,
    default: ''
  },
  priority: { 
    type: String, 
    enum: ['High', 'Mid', 'Low'], 
    default: 'Mid' 
  },
  lastVisitDate: { 
    type: Date,
    default: null
  }
}, { 
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Client', clientSchema);