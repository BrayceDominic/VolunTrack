const express = require('express');
const router = express.Router();
const pController = require('../controllers/pController');

router.post('/create', pController.createProject);
router.get('/:supervisor_id', pController.getProjectsBySupervisor);

module.exports = router;
