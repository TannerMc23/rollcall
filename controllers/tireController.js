const { validationResult } = require('express-validator');
const tireModel = require('../models/tireModel');

async function addTire(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join(' ');
    return res.redirect(`/dashboard?msg=${encodeURIComponent(msg)}&type=error`);
  }

  try {
    const { brand, size, type, quantity, price, low_stock_threshold } = req.body;

    await tireModel.addTire({
      brand: brand.trim(),
      size: size.trim(),
      type,
      quantity: parseInt(quantity, 10) || 0,
      price: parseFloat(price),
      low_stock_threshold: parseInt(low_stock_threshold, 10) || 5
    });

    res.redirect(
      `/dashboard?msg=${encodeURIComponent(brand + ' ' + size + ' added to inventory.')}&type=success`
    );
  } catch (err) {
    console.error('Error adding tire:', err);
    res.redirect(`/dashboard?msg=${encodeURIComponent('Could not add that tire.')}&type=error`);
  }
}

async function updateTire(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join(' ');
    return res.redirect(`/dashboard?msg=${encodeURIComponent(msg)}&type=error`);
  }

  try {
    const { brand, size, type, quantity, price, low_stock_threshold } = req.body;

    await tireModel.updateTire(req.params.id, {
      brand: brand.trim(),
      size: size.trim(),
      type,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      low_stock_threshold: parseInt(low_stock_threshold, 10)
    });

    res.redirect(`/dashboard?msg=${encodeURIComponent('Tire updated.')}&type=success`);
  } catch (err) {
    console.error('Error updating tire:', err);
    res.redirect(
      `/dashboard?msg=${encodeURIComponent(err.message || 'Could not update that tire.')}&type=error`
    );
  }
}

async function deleteTire(req, res) {
  try {
    await tireModel.deactivateTire(req.params.id);
    res.redirect(`/dashboard?msg=${encodeURIComponent('Tire removed from inventory.')}&type=success`);
  } catch (err) {
    console.error('Error removing tire:', err);
    res.redirect(
      `/dashboard?msg=${encodeURIComponent(err.message || 'Could not remove that tire.')}&type=error`
    );
  }
}

module.exports = { addTire, updateTire, deleteTire };
