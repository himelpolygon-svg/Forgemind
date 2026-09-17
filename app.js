require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

require('./db/db'); // ensures schema is created before anything else runs

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const { exposeUser } = require('./middleware/auth');
const flashMiddleware = require('./middleware/flash');
const { SECTIONS, COLLECTIONS } = require('./config/sections');
const { UPLOADS_DIR, SESSIONS_DB_FILE, SESSIONS_DB_DIR } = require('./config/paths');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

if (IS_PRODUCTION) {
  // Railway (and most hosts) sit their own proxy in front of the app; this
  // tells Express to trust its X-Forwarded-* headers so secure cookies and
  // req.ip work correctly.
  app.set('trust proxy', 1);
  if (!process.env.SESSION_SECRET) {
    console.warn('WARNING: SESSION_SECRET is not set. Set it in your host\'s environment variables — using the fallback dev secret in production is not secure.');
  }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Uploaded images: served from UPLOADS_DIR, which points at a persistent
// volume in production (see config/paths.js) instead of the app folder.
app.use('/uploads', express.static(UPLOADS_DIR));

app.use(session({
  store: new SQLiteStore({ db: SESSIONS_DB_FILE, dir: SESSIONS_DB_DIR }),
  secret: process.env.SESSION_SECRET || 'forgemind-cms-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: IS_PRODUCTION,
  },
}));

app.use(exposeUser);
app.use(flashMiddleware);

// Admin-only view locals (nav config + active-link path).
app.use('/admin', (req, res, next) => {
  res.locals.NAV = { SECTIONS, COLLECTIONS };
  res.locals.currentPath = req.path === '/' ? '/admin' : '/admin' + req.path;
  next();
});

app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

app.use((req, res) => {
  res.status(404).send('Not found');
});

// Express-level error handler: turns a thrown/forwarded error into a 500
// response instead of leaking a stack trace or crashing the request.
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).send('Something went wrong. Check the server log for details.');
});

app.listen(PORT, () => {
  console.log(`ForgeMind CMS running at http://localhost:${PORT}`);
  console.log(`Admin panel:            http://localhost:${PORT}/admin`);
});

// Last-resort safety net: log unexpected errors instead of letting one bad
// request (e.g. an async error thrown outside Express's own try/catch, such
// as inside a file-upload stream callback) take down the whole server.
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception (server kept running):', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection (server kept running):', err);
});
