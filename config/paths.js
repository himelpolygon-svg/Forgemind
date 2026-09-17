// All persistent, writable data (the database, session store, and uploaded
// images) is resolved from a single DATA_DIR. Locally, this defaults to
// folders inside the project so `npm start` just works with no setup.
//
// In production (e.g. on Railway), set DATA_DIR to a mounted persistent
// volume (e.g. /data) so the database and uploads survive redeploys —
// otherwise every deploy wipes the container's filesystem and you'd lose
// all content and images.
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'db'); // local dev default: project's own db/ folder

const UPLOADS_DIR = process.env.DATA_DIR
  ? path.join(DATA_DIR, 'uploads')
  : path.join(__dirname, '..', 'public', 'uploads'); // local dev default

for (const dir of [DATA_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// The site's original images (logo, hero photo, service thumbnails, etc.)
// ship with the code in seed-images/. Locally, UPLOADS_DIR already has real
// files, so this is a no-op. On a fresh production deploy, UPLOADS_DIR
// points at an empty persistent volume — this copies over any file that
// isn't already there, so the site isn't missing images on day one, without
// ever overwriting an image someone has since replaced through the admin.
const SEED_IMAGES_DIR = path.join(__dirname, '..', 'seed-images');
if (fs.existsSync(SEED_IMAGES_DIR)) {
  for (const file of fs.readdirSync(SEED_IMAGES_DIR)) {
    const dest = path.join(UPLOADS_DIR, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(SEED_IMAGES_DIR, file), dest);
    }
  }
}

module.exports = {
  DATA_DIR,
  UPLOADS_DIR,
  DB_PATH: path.join(DATA_DIR, 'forgemind.sqlite'),
  SESSIONS_DB_FILE: 'sessions.sqlite',
  SESSIONS_DB_DIR: DATA_DIR,
};
