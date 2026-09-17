function requireLogin(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/admin/login');
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  req.flashMessage = { type: 'error', text: 'That page is for admins only.' };
  return res.redirect('/admin');
}

// Makes the logged-in user (or null) available to every EJS view as `currentUser`.
function exposeUser(req, res, next) {
  res.locals.currentUser = (req.session && req.session.user) || null;
  next();
}

module.exports = { requireLogin, requireAdmin, exposeUser };
