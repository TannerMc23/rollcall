const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const checkAuth = require('../middleware/checkAuth');
const saleController = require('../controllers/saleController');

router.post(
  '/sales',
  checkAuth,
  [
    body('tire_id').isInt().withMessage('Select a tire.'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
    body('customer_name').optional({ checkFalsy: true }).trim()
  ],
  saleController.recordSale
);

module.exports = router;
