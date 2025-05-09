const express = require('express');
const router = express.Router();
const svController = require('../controllers/svController');

// GET /api/supervisors/:id/volunteers
router.get('/:id/volunteers', svController.getAssignedVolunteers);

module.exports = router;
