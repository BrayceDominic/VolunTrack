const db = require('../config/db');

const getFeedbacksBySupervisorId = async (supervisorId) => {
  const [rows] = await db.execute(`
    SELECT 
      feedback.id,
      feedback.feedback,
      feedback.date_submitted,
      users.name AS volunteer_name,
      tasks.title AS task_name
    FROM feedback
    JOIN users ON feedback.volunteer_id = users.id
    JOIN tasks ON feedback.task_id = tasks.id
    WHERE feedback.supervisor_id = ?;
  `, [supervisorId]);

  return rows;
};

const createFeedback = async (volunteerId, supervisorId, taskId, feedbackText) => {
  const dateSubmitted = new Date(); // current date
  const [result] = await db.execute(`
    INSERT INTO feedback (volunteer_id, supervisor_id, task_id, feedback, date_submitted)
    VALUES (?, ?, ?, ?, ?);
  `, [volunteerId, supervisorId, taskId, feedbackText, dateSubmitted]);
  return result.insertId; // return the ID of the new feedback
};

const replyToFeedback = async (feedbackId, replyText) => {
  const replyDate = new Date();
  const [result] = await db.execute(`
    UPDATE feedback
    SET reply = ?, reply_date = ?
    WHERE id = ?;
  `, [replyText, replyDate, feedbackId]);

  return result.affectedRows > 0;
};

const getRepliesByVolunteerId = async (volunteerId) => {
  const [rows] = await db.execute(`
    SELECT 
      feedback.id,
      feedback.reply,
      feedback.reply_date,
      tasks.title AS task_name
    FROM feedback
    JOIN tasks ON feedback.task_id = tasks.id
    WHERE feedback.volunteer_id = ? AND feedback.reply IS NOT NULL;
  `, [volunteerId]);

  return rows;
};


module.exports = {
  getFeedbacksBySupervisorId,createFeedback,replyToFeedback, getRepliesByVolunteerId
};
