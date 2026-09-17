// Minimal session-based flash message (no extra dependency quirks).
function flashMiddleware(req, res, next) {
  res.locals.flash = (req.session && req.session.flash) || null;
  if (req.session) req.session.flash = null;

  req.setFlash = (type, text) => {
    if (req.session) req.session.flash = { type, text };
  };
  next();
}

module.exports = flashMiddleware;
