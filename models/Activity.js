const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  remark: {
    type: String,
    required: true,
    trim: true
  },
  activityType: {
    type: String,
    enum: ['Call', 'Visit', 'Email', 'Follow-up', 'Note'],
    default: 'Note'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Remove the pre-save hook entirely to avoid the error
// The updatedAt will be set manually in the controller if needed

module.exports = mongoose.model('Activity', activitySchema);