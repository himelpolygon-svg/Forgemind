const bcrypt = require('bcryptjs');
const { db } = require('./db');

function listUsers() {
  return db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id').all();
}

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
}

function getUserById(id) {
  return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);
}

function createUser({ name, email, password, role }) {
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
    .run(name, email.trim().toLowerCase(), hash, role === 'admin' ? 'admin' : 'editor');
  return info.lastInsertRowid;
}

function updateUserRole(id, role) {
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role === 'admin' ? 'admin' : 'editor', id);
}

function updateUserPassword(id, password) {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id);
}

function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

function countAdmins() {
  return db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'admin'").get().c;
}

function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.password_hash);
}

module.exports = {
  listUsers, getUserByEmail, getUserById, createUser,
  updateUserRole, updateUserPassword, deleteUser, countAdmins, verifyPassword,
};
