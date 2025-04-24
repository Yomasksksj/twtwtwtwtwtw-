const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const validate = require('../middleware/validator');
const { validateCustomerCreate, validateCustomerUpdate, validateLogin } = require('../validation/schemas');
const authenticate = require('../middleware/auth');

// Public routes
router.post('/zakaznik', validate(validateCustomerCreate), customerController.create);
router.post('/login', validate(validateLogin), customerController.login);
router.post('/zakaznik/:id', authenticate, validate(validateCustomerUpdate), customerController.update);

// Protected routes (require authentication)
router.get('/zakaznik', authenticate, customerController.getAll);
router.get('/zakaznik/:id', authenticate, customerController.getById);
router.post('/zakaznik/:id', authenticate, validate(validateCustomerUpdate), customerController.update);
router.post('/delete/zakaznik/:id', authenticate, customerController.delete);

module.exports = router;