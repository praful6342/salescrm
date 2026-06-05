const Activity = require('../models/Activity');

// Get all activities for a specific client (sorted by newest first)
exports.getActivitiesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const activities = await Activity.find({ clientId })
      .sort({ createdAt: -1 }); // Newest first
    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// Add a new activity for a client
exports.addActivity = async (req, res) => {
  try {
    const { clientId, remark, activityType } = req.body;
    
    // Validate input
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }
    
    if (!remark || remark.trim() === '') {
      return res.status(400).json({ error: 'Remark cannot be empty' });
    }
    
    const trimmedRemark = remark.trim();
    
    // Create new activity
    const newActivity = new Activity({
      clientId,
      remark: trimmedRemark,
      activityType: activityType || 'Note'
    });
    
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    console.error('Error adding activity:', err);
    res.status(500).json({ error: 'Failed to add activity: ' + err.message });
  }
};

// Update an existing activity
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark, activityType } = req.body;
    
    const updateData = {};
    if (remark && remark.trim() !== '') {
      updateData.remark = remark.trim();
    }
    if (activityType) {
      updateData.activityType = activityType;
    }
    
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(updatedActivity);
  } catch (err) {
    console.error('Error updating activity:', err);
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(id);
    
    if (!deletedActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};