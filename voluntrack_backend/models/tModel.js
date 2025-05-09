// models/taskModel.js
const db = require('../config/db'); // Assuming your database connection is in 'config/database.js'

const createTask = async ({ project_id, due_date, supervisor_id, title, description, volunteer_id  }) => {
  const [result] = await db.query(
    `INSERT INTO tasks (project_id, due_date, supervisor_id, title, description, volunteer_id ) VALUES (?, ?, ?, ?, ?, ?)`,
    [project_id, due_date, supervisor_id, title, description, volunteer_id ]
  );
  return result.insertId;
};

const getTasksByProjects = async (supervisor_id) => {
  const [tasks] = await db.query(
    `SELECT * FROM tasks WHERE supervisor_id = ?`,
    [supervisor_id]
  );
  return tasks;
};

const getTasksByVolunteers = async (volunteer_id) => {
  const [tasks] = await db.query(
    `SELECT * FROM tasks WHERE volunteer_id = ?`,
    [volunteer_id]
  );
  return tasks;
};

module.exports = {
  createTask,
  getTasksByProjects,
  getTasksByVolunteers,
};


