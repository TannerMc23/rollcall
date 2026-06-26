const customerModel = require('../models/customerModel');

async function showCustomers(req, res) {
  try {
    const customers = await customerModel.getAllCustomers();
    res.render('customers', {
      customers,
      message: req.query.msg || null,
      messageType: req.query.type || 'success'
    });
  } catch (err) {
    console.error('Error loading customers:', err);
    res.status(500).send('Something went wrong loading the customers page.');
  }
}

async function showCustomer(req, res) {
  try {
    const customer = await customerModel.getCustomerById(req.params.id);
    if (!customer) {
      return res.redirect('/customers?msg=Customer+not+found.&type=error');
    }
    const sales = await customerModel.getCustomerSales(req.params.id);
    const totalTires = sales.reduce((sum, s) => sum + Number(s.quantity), 0);
    const totalSpent = sales.reduce((sum, s) => sum + Number(s.quantity) * Number(s.sale_price), 0);
    res.render('customer-detail', { customer, sales, totalTires, totalSpent });
  } catch (err) {
    console.error('Error loading customer detail:', err);
    res.status(500).send('Something went wrong loading that customer.');
  }
}

module.exports = { showCustomers, showCustomer };
