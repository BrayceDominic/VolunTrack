const db = require('../config/db');

const getVolunteersBySupervisorId = async (supervisorId) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.phone 
     FROM Users u
     INNER JOIN SupervisorVolunteer sv ON u.id = sv.volunteer_id
     WHERE sv.supervisor_id = ?`,
    [supervisorId]
  );
  return rows;
};

module.exports = {
  getVolunteersBySupervisorId,
};
