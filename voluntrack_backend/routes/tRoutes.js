const express = require('express');
const router = express.Router();
const tController = require('../controllers/tController');

router.post('/create', tController.createTask);
router.get('/:supervisor_id', tController.getTasksByProjects);
router.get('/:volunteer_id', tController.getTasksByVolunteers);

module.exports = router;
