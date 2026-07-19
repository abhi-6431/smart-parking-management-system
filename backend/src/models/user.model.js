const { pool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, password_hash, role, phone, created_at FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create({ name, email, passwordHash, phone }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, phone || null]
  );
  return findById(result.insertId);
}

async function updateProfile(id, { name, phone }) {
  await pool.execute('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone || null, id]);
  return findById(id);
}

async function updatePassword(id, passwordHash) {
  await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function list({ search = '', limit = 100, offset = 0 } = {}) {
  const term = `%${search}%`;
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const [rows] = await pool.execute(`SELECT id, name, email, phone, role, created_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`, [term, term]);
  return rows;
}

module.exports = { findByEmail, findById, create, updateProfile, updatePassword, list };
