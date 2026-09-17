const multer = require('multer');
const path = require('path');
const { UPLOADS_DIR: UPLOAD_DIR } = require('../config/paths');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const unique = Date.now() + '_' + Math.round(Math.random() * 1e6);
    cb(null, `${base}_${unique}${ext}`);
  },
});

const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED.has(ext)) return cb(new Error('Only image files (png, jpg, webp, gif, svg) are allowed.'));
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });

module.exports = { upload, UPLOAD_DIR };
