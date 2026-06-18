const { getExpectedToken } = require('../controllers/authController');

function checkAuth(req, res, next) {
  if (req.cookies && req.cookies.rollcall_auth === getExpectedToken()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = checkAuth;
