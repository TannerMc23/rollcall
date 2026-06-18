const tireModel = require('../models/tireModel');
const saleModel = require('../models/saleModel');

async function showDashboard(req, res) {
  try {
    const [tires, stats, recentSales, todaysSales] = await Promise.all([
      tireModel.getAllTires(),
      tireModel.getInventoryStats(),
      saleModel.getRecentSales(10),
      saleModel.getTodaysSalesTotal()
    ]);

    res.render('dashboard', {
      tires,
      stats,
      recentSales,
      todaysSales,
      message: req.query.msg || null,
      messageType: req.query.type || 'success'
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Something went wrong loading the dashboard.');
  }
}

module.exports = { showDashboard };
