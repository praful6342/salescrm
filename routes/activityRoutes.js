const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// GET /api/activities/client/:clientId - Get all activities for a specific client
router.get('/client/:clientId', activityController.getActivitiesByClient);

// POST /api/activities - Add a new activity for a client
router.post('/', activityController.addActivity);

// PUT /api/activities/:id - Edit an existing activity
router.put('/:id', activityController.updateActivity);

// DELETE /api/activities/:id - Delete an activity
router.delete('/:id', activityController.deleteActivity);

module.exports = router;