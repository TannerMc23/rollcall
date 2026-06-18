const { validationResult } = require('express-validator');
const saleModel = require('../models/saleModel');
const tireModel = require('../models/tireModel');

async function recordSale(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join(' ');
    return res.redirect(`/dashboard?msg=${encodeURIComponent(msg)}&type=error`);
  }

  try {
    const { tire_id, quantity, customer_name } = req.body;

    const tire = await tireModel.getTireById(tire_id);
    if (!tire) {
      return res.redirect(`/dashboard?msg=${encodeURIComponent('Tire not found.')}&type=error`);
    }

    await saleModel.recordSale(tire_id, parseInt(quantity, 10), tire.price, customer_name);

    res.redirect(`/dashboard?msg=${encodeURIComponent('Sale recorded.')}&type=success`);
  } catch (err) {
    console.error('Error recording sale:', err);
    res.redirect(
      `/dashboard?msg=${encodeURIComponent(err.message || 'Could not record that sale.')}&type=error`
    );
  }
}

async function deleteSale(req, res) {
  try {
    await saleModel.deleteSale(req.params.id);
    res.redirect(`/dashboard?msg=${encodeURIComponent('Sale removed and stock restored.')}&type=success`);
  } catch (err) {
    console.error('Error deleting sale:', err);
    res.redirect(
      `/dashboard?msg=${encodeURIComponent(err.message || 'Could not remove that sale.')}&type=error`
    );
  }
}

module.exports = { recordSale, deleteSale };
