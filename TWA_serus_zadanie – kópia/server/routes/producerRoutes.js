// routes/producerRoutes.js
const express = require('express');
const router = express.Router();
const producerController = require('../controllers/producerController');
const validate = require('../middleware/validator');
const { validateProducerCreate, validateProducerUpdate } = require('../validation/schemas');
const authenticate = require('../middleware/auth');

// Public endpoints
router.get('/producent', producerController.getAll);
router.get('/producent/:id', producerController.getById);
router.get('/producent/nazov/:name', producerController.getByName);
router.get('/producent/:id/tracks', producerController.getTracks);

// Protected endpoints (require authentication)
router.post('/producent', authenticate, validate(validateProducerCreate), producerController.create);
router.post('/producent/:id', authenticate, validate(validateProducerUpdate), producerController.update);
router.post('/delete/producent/:id', authenticate, producerController.delete);

module.exports = router;