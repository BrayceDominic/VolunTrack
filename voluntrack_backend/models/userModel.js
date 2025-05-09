const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  createUser: async (username, hashedPassword, role, email, name, phone) => {
    const query = 'INSERT INTO Users (username, password, role, email, name, phone) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [username, hashedPassword, role, email, name, phone]);
    return result;
  },

  findUserByEmail: async (email) => {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  },

  getUserByEmail: async (email) => {
    const query = 'SELECT username FROM Users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];      
  },

  updatePassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `UPDATE Users SET password = ? WHERE email = ?`;
    const [result] = await db.execute(query, [hashedPassword, email]);
    return result;
  },

  setResetToken: async (email, token, expires) => {
    const query = `UPDATE Users SET reset_token = ?, reset_token_expires = ? WHERE email = ?`;
    const [result] = await db.execute(query, [token, expires, email]);
    return result;
  },

  findByResetToken: async (token) => {
    const query = `SELECT * FROM Users WHERE reset_token = ? AND reset_token_expires > NOW()`;
    const [rows] = await db.execute(query, [token]);
    return rows[0];
  },

  clearResetToken: async (email) => {
    const query = `UPDATE Users SET reset_token = NULL, reset_token_expires = NULL WHERE email = ?`;
    const [result] = await db.execute(query, [email]);
    return result;
  },
};

module.exports = User;
