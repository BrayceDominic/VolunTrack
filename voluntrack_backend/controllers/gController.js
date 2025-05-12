const Grade = require('../models/gModel');

exports.addGrade = async (req, res) => {
  try {
    await Grade.addGrade(req.body);
    res.status(201).json({ message: 'Grade added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesBySupervisor = async (req, res) => {
  try {
    const [grades] = await Grade.getGradesBySupervisor(req.params.supervisorId);
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesByVolunteer = async (req, res) => {
  try {
    const [grades] = await Grade.getGradesByVolunteer(req.params.volunteerId);
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};