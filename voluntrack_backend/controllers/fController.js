const Feedback = require('../models/fModel');
const db = require('../config/db');


const getFeedbacksBySupervisor = async (req, res) => {
  const { supervisor_id } = req.params;

  try {
    const feedbacks = await Feedback.getFeedbacksBySupervisorId(supervisor_id);

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedbacks found for this supervisor' });
    }

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Error in getFeedbacksBySupervisor:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createFeedback = async (req, res) => {
  const { volunteer_id, supervisor_id, task_id, feedback } = req.body;

  try {
    if (!volunteer_id || !supervisor_id || !task_id || !feedback) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const feedbackId = await Feedback.createFeedback(volunteer_id, supervisor_id, task_id, feedback);

    res.status(201).json({ message: 'Feedback submitted successfully', feedbackId });
  } catch (err) {
    console.error("❌ Error in createFeedback:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const replyToFeedback = async (req, res) => {
  const { feedback_id, reply } = req.body;

  try {
    if (!feedback_id || !reply) {
      return res.status(400).json({ message: 'Feedback ID and reply are required' });
    }

    const replyDate = new Date();
    const [result] = await db.execute(`
      UPDATE feedback
      SET reply = ?, reply_date = ?
      WHERE id = ?;
    `, [reply, replyDate, feedback_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Reply added successfully' });
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (err) {
    console.error("❌ Error in replyToFeedback:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRepliesByVolunteer = async (req, res) => {
  const { volunteer_id } = req.params;

  try {
    const replies = await Feedback.getRepliesByVolunteerId(volunteer_id);

    if (!replies || replies.length === 0) {
      return res.status(404).json({ message: 'No replies found for this volunteer' });
    }

    res.status(200).json(replies);
  } catch (err) {
    console.error("❌ Error in getRepliesByVolunteer:", err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { getFeedbacksBySupervisor, createFeedback, replyToFeedback, getRepliesByVolunteer };
