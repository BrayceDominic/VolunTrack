const express = require('express');
const router = express.Router();
const { getFeedbacksBySupervisor, createFeedback, replyToFeedback, getRepliesByVolunteer } = require('../controllers/fController');

// GET feedbacks for specific supervisor
router.get('/feedback/:supervisor_id', getFeedbacksBySupervisor);
router.post('/feedback', createFeedback);
router.post('/reply/:feedbackId', replyToFeedback) 
router.get('/replies/:volunteer_id', getRepliesByVolunteer);


module.exports = router;
