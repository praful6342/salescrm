const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// No authentication middleware (since login is removed)

// GET /clients - List all clients (with search, filter, pagination)
router.get('/', clientController.listClients);

// GET /clients/new - Show form to add a new client
router.get('/new', clientController.newClientForm);

// POST /clients - Create a new client
router.post('/', clientController.createClient);

// GET /clients/export - Export all clients as CSV
router.get('/export', clientController.exportClients);

// GET /clients/:id/edit - Show edit form for a specific client (must come before /:id)
router.get('/:id/edit', clientController.editClientForm);

// PUT /clients/:id - Update a specific client
router.put('/:id', clientController.updateClient);

// DELETE /clients/:id - Delete a specific client
router.delete('/:id', clientController.deleteClient);

// GET /clients/:id - Show a single client with activities (must come LAST)
router.get('/:id', clientController.showClient);

module.exports = router;