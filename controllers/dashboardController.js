const tireModel = require('../models/tireModel');
const saleModel = require('../models/saleModel');
const customerModel = require('../models/customerModel');

async function showDashboard(req, res) {
  try {
    const [tires, stats, recentSales, todaysSales, customerNames] = await Promise.all([
      tireModel.getAllTires(),
      tireModel.getInventoryStats(),
      saleModel.getRecentSales(10),
      saleModel.getTodaysSalesTotal(),
      customerModel.getAllCustomerNames()
    ]);

    res.render('dashboard', {
      tires,
      stats,
      recentSales,
      todaysSales,
      customerNames,
      message: req.query.msg || null,
      messageType: req.query.type || 'success'
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Something went wrong loading the dashboard.');
  }
}

module.exports = { showDashboard };
