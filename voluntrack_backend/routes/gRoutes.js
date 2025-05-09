const express = require('express');
const router = express.Router();
const gController = require('../controllers/gController');

router.post('/add', gController.addGrade);
router.get('/supervisor/:supervisorId', gController.getGradesBySupervisor);

module.exports = router;
