const Volunteer = require('../models/vModel');

const getVolunteerById = async (req, res) => {
  const { id } = req.params;

  try {
    const volunteerTasks = await Volunteer.getVolunteerById(id);

    if (!volunteerTasks || volunteerTasks.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found or has no tasks' });
    }

    res.json(volunteerTasks); // return array of tasks
  } catch (err) {
    console.error("❌ Error in getVolunteerById:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getVolunteerById };
