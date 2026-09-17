const { db } = require('./db');

/** Get all content_blocks for a section as a simple { field_key: value } map. */
function getSection(section) {
  const rows = db.prepare('SELECT field_key, value FROM content_blocks WHERE section = ?').all(section);
  const out = {};
  for (const row of rows) out[row.field_key] = row.value;
  return out;
}

/** Get every content_blocks row for a section (with field_type), for building admin forms. */
function getSectionRows(section) {
  return db.prepare('SELECT * FROM content_blocks WHERE section = ? ORDER BY id').all(section);
}

function getAllSections() {
  const rows = db.prepare('SELECT DISTINCT section FROM content_blocks ORDER BY section').all();
  return rows.map(r => r.section);
}

/** Upsert a single field's value. */
function setField(section, field_key, value, field_type) {
  const existing = db.prepare('SELECT id, field_type FROM content_blocks WHERE section = ? AND field_key = ?').get(section, field_key);
  if (existing) {
    db.prepare('UPDATE content_blocks SET value = ? WHERE id = ?').run(value, existing.id);
  } else {
    db.prepare('INSERT INTO content_blocks (section, field_key, field_type, value) VALUES (?,?,?,?)')
      .run(section, field_key, field_type || 'text', value);
  }
}

/** Seed a field only if it doesn't already exist (used by the seed script). */
function seedField(section, field_key, value, field_type) {
  const existing = db.prepare('SELECT id FROM content_blocks WHERE section = ? AND field_key = ?').get(section, field_key);
  if (!existing) {
    db.prepare('INSERT INTO content_blocks (section, field_key, field_type, value) VALUES (?,?,?,?)')
      .run(section, field_key, field_type || 'text', value);
  }
}

module.exports = { getSection, getSectionRows, getAllSections, setField, seedField };
