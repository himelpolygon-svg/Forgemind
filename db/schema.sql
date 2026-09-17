-- ForgeMind CMS schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- 'admin' | 'editor'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Generic key/value content store. Each row is one editable field
-- (heading, paragraph, button label, image path, ...) grouped by "section".
CREATE TABLE IF NOT EXISTS content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text', -- 'text' | 'richtext' | 'image'
  value TEXT NOT NULL DEFAULT '',
  UNIQUE(section, field_key)
);

-- Repeatable / structural lists: services, products, team members,
-- core values. Admins can add, edit, remove, reorder, and (de)activate.
CREATE TABLE IF NOT EXISTS collection_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection TEXT NOT NULL, -- 'services' | 'products' | 'team' | 'core_values'
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  link_1 TEXT NOT NULL DEFAULT '',
  link_2 TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  uploaded_by TEXT,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);
