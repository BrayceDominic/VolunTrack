const express = require('express');
const router = express.Router();
const { getVolunteerById } = require('../controllers/vController');

router.get('/volunteers/:id', getVolunteerById);



module.exports = router;
