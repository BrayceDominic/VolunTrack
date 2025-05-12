const passwordModel = require("../models/passwordModel");

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  try {
    const result = await passwordModel.updatePassword(email, newPassword);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error updating password", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { resetPassword };
