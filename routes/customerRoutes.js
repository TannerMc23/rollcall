const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const customerController = require('../controllers/customerController');

router.get('/customers', checkAuth, customerController.showCustomers);
router.get('/customers/:id', checkAuth, customerController.showCustomer);

module.exports = router;
