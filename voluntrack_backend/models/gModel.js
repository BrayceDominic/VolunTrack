const db = require('../config/db');

exports.addGrade = (data) => {
  const { supervisor_id, volunteer_id, task_id, score, comments } = data;
  return db.execute(
    'INSERT INTO grades (supervisor_id, volunteer_id, task_id, score, comments) VALUES (?, ?, ?, ?, ?)',
    [supervisor_id, volunteer_id, task_id, score, comments]
  );
};

exports.getGradesBySupervisor = (supervisor_id) => {
  return db.execute(
    `SELECT g.*, u.name AS volunteer_name, t.title AS task_title
     FROM grades g
     JOIN users u ON g.volunteer_id = u.id
     JOIN tasks t ON g.task_id = t.id
     WHERE g.supervisor_id = ?`,
    [supervisor_id]
  );
};

exports.getGradesByVolunteer = (volunteer_id) => {
  return db.execute(
    `SELECT g.score, g.comments, t.title AS task_title
     FROM grades g
     JOIN tasks t ON g.task_id = t.id
     WHERE g.volunteer_id = ?`,
    [volunteer_id]
  );
};