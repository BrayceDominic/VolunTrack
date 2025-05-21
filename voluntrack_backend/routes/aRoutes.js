const express = require('express');
const router = express.Router();
const aController = require('../controllers/aController');

router.post('/mark', aController.mark);
router.get('/detailed', aController.getDetailedAttendance);
router.get('/:supervisor_id', aController.getAttendanceBySupervisor);
router.get('/:volunteer_id', aController.getAttendanceByVolunteer);

module.exports = router;
