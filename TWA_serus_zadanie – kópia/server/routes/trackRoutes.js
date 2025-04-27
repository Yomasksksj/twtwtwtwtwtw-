// routes/trackRoutes.js
const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const validate = require('../middleware/validator');
const { validateTrackCreate, validateTrackUpdate } = require('../validation/schemas');
const authenticate = require('../middleware/auth');

// Verejné endpointy
router.get('/skladba', trackController.getAll);
router.get('/skladba/:id', trackController.getById);

// Chránené endpointy (vyžadujú autentifikáciu)
router.post('/skladba', authenticate, validate(validateTrackCreate), trackController.create);
router.post('/skladba/:id', authenticate, validate(validateTrackUpdate), trackController.update);
router.post('/delete/skladba/:id', authenticate, trackController.delete);

module.exports = router;