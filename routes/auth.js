const express = require('express');
const router = express.Router();
const { getUserByEmail, verifyPassword } = require('../db/users');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = email ? getUserByEmail(email) : null;
  if (!user || !verifyPassword(user, password || '')) {
    return res.render('admin/login', { error: 'Incorrect email or password.' });
  }
  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

module.exports = router;
