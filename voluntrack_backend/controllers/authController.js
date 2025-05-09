const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { sendPasswordResetEmail } = require('../emailService');


const registerUser = async (req, res) => {
  const { username, password, role, email, name, phone } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser( username, hashedPassword, role, email, name, phone);

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered', token,
      user: {
      id: User.id,
      name: User.name,
      email: User.email,
      role: User.role,
      phone: User.phone,
    }, });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username:user.username
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
      const email = req.user.email; // comes from decoded token
      const user = await getUserByEmail(email);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
          username: user.username,
          role: user.role
      });

  } catch (error) {
      return res.status(500).json({ message: "Server error", error });
  }
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM Users WHERE email = ?';
  const [rows] = await db.execute(query, [email]);
  return rows[0];  // Return the first row if the user is found
};

const updatePassword = async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    await User.updatePassword(email, newPassword);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ error: "Failed to update password." });
  }
};

// Send reset token to user email (or return it for now)
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'No user found with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await User.setResetToken(email, resetToken, tokenExpires);

    // Send resetToken via email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ error: 'Failed to process password reset request.' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const user = await User.findByResetToken(token);
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    await User.updatePassword(user.email, newPassword);
    await User.clearResetToken(user.email);

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};



module.exports = { registerUser, loginUser, getLoggedInUser, findUserByEmail, updatePassword, requestPasswordReset, resetPassword};
