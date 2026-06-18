const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const checkAuth = require('../middleware/checkAuth');
const tireController = require('../controllers/tireController');

router.post(
  '/tires',
  checkAuth,
  [
    body('brand').trim().notEmpty().withMessage('Brand is required.'),
    body('size').trim().notEmpty().withMessage('Size is required.'),
    body('type').isIn(['New', 'Used', 'Retread']).withMessage('Choose a valid tire type.'),
    body('price').isFloat({ gt: 0 }).withMessage('Enter a valid price.'),
    body('quantity').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Quantity must be 0 or more.'),
    body('low_stock_threshold')
      .optional({ checkFalsy: true })
      .isInt({ min: 0 })
      .withMessage('Threshold must be 0 or more.')
  ],
  tireController.addTire
);

module.exports = router;
