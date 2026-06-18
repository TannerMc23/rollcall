const crypto = require('crypto');

// Stateless auth: instead of a server-side session (which would get wiped
// every time Render's free tier spins the app down and back up), the login
// cookie is a value that can be re-derived from the password and a secret.
// Anyone with the right cookie value must have known the password at some
// point, and the cookie itself never reveals the password.
function getExpectedToken() {
  return crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(process.env.APP_PASSWORD)
    .digest('hex');
}

function showLogin(req, res) {
  res.render('login', { error: req.query.error || null });
}

function login(req, res) {
  const { password } = req.body;
  if (password && password === process.env.APP_PASSWORD) {
    res.cookie('rollcall_auth', getExpectedToken(), {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return res.redirect('/dashboard');
  }
  res.redirect('/login?error=' + encodeURIComponent('Incorrect password'));
}

function logout(req, res) {
  res.clearCookie('rollcall_auth');
  res.redirect('/login');
}

module.exports = { showLogin, login, logout, getExpectedToken };
