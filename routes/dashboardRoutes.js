const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', checkAuth, dashboardController.showDashboard);

module.exports = router;
