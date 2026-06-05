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
  expectedAmount: {
    type: Number,
    default: 0,
    min: 0
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
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved', 'Closed'],
    default: 'Open'
  },
  closedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Automatically set closedAt when status changes to 'Closed' or 'Resolved'
clientSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'Closed' || this.status === 'Resolved') {
      if (!this.closedAt) {
        this.closedAt = new Date();
      }
    } else if (this.status === 'Open') {
      // Reset closedAt when reopening a client
      this.closedAt = null;
    }
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);