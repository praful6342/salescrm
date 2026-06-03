const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// No authentication middleware

router.get('/', clientController.listClients);
router.get('/new', clientController.newClientForm);
router.post('/', clientController.createClient);
router.get('/export', clientController.exportClients);
router.get('/:id/edit', clientController.editClientForm);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;