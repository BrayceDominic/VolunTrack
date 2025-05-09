const db = require('../config/db'); // should be a mysql2/promise connection

const Attendance = {
  mark: async (data) => {
    const { volunteer_id, project_id, task_id, supervisor_id, session_date } = data;
    const sql = `
      INSERT INTO attendance (volunteer_id, project_id, task_id, supervisor_id, session_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    return await db.query(sql, [volunteer_id, project_id, task_id, supervisor_id, session_date]);
  },

  getDetailedAttendance: async () => {
    const sql = `
      SELECT 
        u.name AS volunteer_name,
        p.name AS project_title,
        t.title AS task_title,
        s.name AS supervisor_name,
        a.session_date,
        a.timestamp
      FROM attendance a
      JOIN users u ON a.volunteer_id = u.id
      JOIN projects p ON a.project_id = p.id
      JOIN tasks t ON a.task_id = t.id
      JOIN users s ON a.supervisor_id = s.id
    `;
    return await db.query(sql); // returns [rows, fields]
  },

  getAttendanceBySupervisorId: async (supervisor_id) => {
    const query = `
      SELECT 
        a.id,
        u.name AS volunteer_name,
        p.name AS project_name,
        t.title AS task_title,
        a.timestamp
      FROM attendance a
      JOIN users u ON a.volunteer_id = u.id
      JOIN projects p ON a.project_id = p.id
      JOIN tasks t ON a.task_id = t.id
      WHERE a.supervisor_id = ?
      ORDER BY a.timestamp DESC
    `;
    const [rows] = await db.query(query, [supervisor_id]);
    return rows;
  }
};

// ✅ Export after the object is fully closed
module.exports = Attendance;
