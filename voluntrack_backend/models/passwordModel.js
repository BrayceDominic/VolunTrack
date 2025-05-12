const bcrypt = require("bcrypt");
const db = require("../config/db"); // Assuming you have a db configuration file

const updatePassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `UPDATE Users SET password = ? WHERE email = ?`;
  const [result] = await db.execute(query, [hashedPassword, email]);
  return result;
};

module.exports = { updatePassword };
