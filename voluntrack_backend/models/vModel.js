const db = require('../config/db');

const getVolunteerById = async (volunteerId) => {
  const [results] = await db.query(
    `SELECT 
       users.name AS volunteer_name,
       users.password AS password,
       users.email AS volunteer_email,
       tasks.id AS task_id,
       tasks.title AS task_title,
       tasks.description AS task_description,
       tasks.due_date,
       projects.id AS project_id,
       projects.name AS project_name,
       tasks.supervisor_id
     FROM users
     LEFT JOIN feedback ON users.id = feedback.volunteer_id
     LEFT JOIN tasks ON feedback.task_id = tasks.id
     LEFT JOIN projects ON tasks.project_id = projects.id
     WHERE users.id = ?
     GROUP BY tasks.id, projects.id`,
    [volunteerId]
  );
  return results;
};



module.exports = {
  getVolunteerById
};


