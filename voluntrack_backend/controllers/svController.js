const svModel = require('../models/svModel');

const getAssignedVolunteers = async (req, res) => {
  try {
    const supervisorId = req.params.id;
    const volunteers = await svModel.getVolunteersBySupervisorId(supervisorId);
    res.status(200).json(volunteers);
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: 'Failed to retrieve volunteers.' });
  }
};

module.exports = {
  getAssignedVolunteers,
};
