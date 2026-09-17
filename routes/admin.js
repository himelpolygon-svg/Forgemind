const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../db/db');
const { getSectionRows, setField } = require('../db/content');
const collections = require('../db/collections');
const users = require('../db/users');
const { SECTIONS, COLLECTIONS, findSection, findCollection } = require('../config/sections');
const { requireLogin, requireAdmin } = require('../middleware/auth');
const { upload, UPLOAD_DIR } = require('../middleware/upload');

router.use(requireLogin);

// ---------- DASHBOARD ----------
router.get('/', (req, res) => {
  const groups = {};
  for (const s of SECTIONS) {
    groups[s.group] = groups[s.group] || { sections: [], collections: [] };
    groups[s.group].sections.push(s);
  }
  for (const c of COLLECTIONS) {
    groups[c.group] = groups[c.group] || { sections: [], collections: [] };
    groups[c.group].collections.push(c);
  }
  res.render('admin/dashboard', { groups });
});

// ---------- GENERIC SECTION EDITOR ----------
router.get('/section/:key', (req, res) => {
  const meta = findSection(req.params.key);
  if (!meta) return res.status(404).send('Unknown section');
  const rows = getSectionRows(req.params.key);
  res.render('admin/section-form', { meta, rows });
});

router.post('/section/:key', upload.any(), (req, res) => {
  const meta = findSection(req.params.key);
  if (!meta) return res.status(404).send('Unknown section');
  const rows = getSectionRows(req.params.key);

  // Map uploaded files by fieldname for quick lookup.
  const filesByField = {};
  for (const f of req.files || []) filesByField[f.fieldname] = f;

  for (const row of rows) {
    if (row.field_type === 'image') {
      const uploaded = filesByField[row.field_key];
      if (uploaded) {
        setField(meta.key, row.field_key, '/uploads/' + uploaded.filename, 'image');
      }
      // if no new file chosen, leave the existing image value untouched
    } else {
      const val = req.body[row.field_key];
      if (val !== undefined) setField(meta.key, row.field_key, val, row.field_type);
    }
  }
  req.setFlash('success', `${meta.label} updated.`);
  res.redirect('/admin/section/' + meta.key);
});

// ---------- GENERIC COLLECTION MANAGER ----------
router.get('/collection/:key', (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).send('Unknown collection');
  const items = collections.listAll(req.params.key);
  res.render('admin/collection-list', { meta, items });
});

router.get('/collection/:key/new', (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).send('Unknown collection');
  res.render('admin/collection-form', { meta, item: null });
});

router.post('/collection/:key/new', upload.single('image'), (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).send('Unknown collection');
  const data = { ...req.body };
  if (req.file) data.image = '/uploads/' + req.file.filename;
  collections.createItem(meta.key, data);
  req.setFlash('success', 'Item added.');
  res.redirect('/admin/collection/' + meta.key);
});

router.get('/collection/:key/:id/edit', (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).send('Unknown collection');
  const item = collections.getItem(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.render('admin/collection-form', { meta, item });
});

router.post('/collection/:key/:id/edit', upload.single('image'), (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).send('Unknown collection');
  const data = { ...req.body };
  data.is_active = req.body.is_active ? 1 : 0;
  if (req.file) data.image = '/uploads/' + req.file.filename;
  collections.updateItem(req.params.id, data);
  req.setFlash('success', 'Item updated.');
  res.redirect('/admin/collection/' + meta.key);
});

router.post('/collection/:key/:id/delete', (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).send('Unknown collection');
  collections.deleteItem(req.params.id);
  req.setFlash('success', 'Item deleted.');
  res.redirect('/admin/collection/' + meta.key);
});

router.post('/collection/:key/reorder', express.json(), (req, res) => {
  const meta = findCollection(req.params.key);
  if (!meta) return res.status(404).json({ ok: false });
  const ids = (req.body.ids || []).map(Number);
  collections.reorder(meta.key, ids);
  res.json({ ok: true });
});

// ---------- MEDIA LIBRARY ----------
router.get('/media', (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR)
    .filter(f => !f.startsWith('.'))
    .map(f => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, f));
      return { name: f, url: '/uploads/' + f, size: stat.size, mtime: stat.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
  res.render('admin/media', { files });
});

router.post('/media/upload', upload.array('files', 20), (req, res) => {
  req.setFlash('success', `${(req.files || []).length} file(s) uploaded.`);
  res.redirect('/admin/media');
});

router.post('/media/:filename/delete', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (filePath.startsWith(UPLOAD_DIR) && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    req.setFlash('success', 'File deleted.');
  }
  res.redirect('/admin/media');
});

// ---------- USERS (admin only) ----------
router.get('/users', requireAdmin, (req, res) => {
  res.render('admin/users', { list: users.listUsers() });
});

router.post('/users/new', requireAdmin, (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    req.setFlash('error', 'Name, email and password are all required.');
    return res.redirect('/admin/users');
  }
  if (users.getUserByEmail(email)) {
    req.setFlash('error', 'A user with that email already exists.');
    return res.redirect('/admin/users');
  }
  users.createUser({ name, email, password, role });
  req.setFlash('success', `${name} was added.`);
  res.redirect('/admin/users');
});

router.post('/users/:id/role', requireAdmin, (req, res) => {
  users.updateUserRole(req.params.id, req.body.role);
  req.setFlash('success', 'Role updated.');
  res.redirect('/admin/users');
});

router.post('/users/:id/password', requireAdmin, (req, res) => {
  if (!req.body.password) {
    req.setFlash('error', 'Enter a new password.');
    return res.redirect('/admin/users');
  }
  users.updateUserPassword(req.params.id, req.body.password);
  req.setFlash('success', 'Password reset.');
  res.redirect('/admin/users');
});

router.post('/users/:id/delete', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (id === req.session.user.id) {
    req.setFlash('error', "You can't delete your own account while logged in.");
    return res.redirect('/admin/users');
  }
  const target = users.getUserById(id);
  if (target && target.role === 'admin' && users.countAdmins() <= 1) {
    req.setFlash('error', 'You must keep at least one admin account.');
    return res.redirect('/admin/users');
  }
  users.deleteUser(id);
  req.setFlash('success', 'User removed.');
  res.redirect('/admin/users');
});

module.exports = router;
