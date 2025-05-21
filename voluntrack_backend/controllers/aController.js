const Attendance = require('../models/aModel');

exports.mark = async (req, res) => {
  try {
    const [result] = await Attendance.mark(req.body); // Destructure from [rows, fields]
    res.status(201).json({ message: "Attendance marked successfully", data: result });
  } catch (err) {
    console.error("Mark Attendance Error:", err);
    res.status(500).json({ error: "Failed to mark attendance", details: err.message });
  }
};

exports.getDetailedAttendance = async (req, res) => {
  try {
    const [rows] = await Attendance.getDetailedAttendance(); // Destructure to get rows
    res.status(200).json(rows);
  } catch (err) {
    console.error("Detailed Attendance Error:", err);
    res.status(500).json({ error: "Failed to fetch attendance data", details: err.message });
  }
};

exports.getAttendanceBySupervisor = async (req, res) => {
  const { supervisor_id } = req.params;

  try {
    const records = await Attendance.getAttendanceBySupervisorId(supervisor_id);
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceByVolunteer = async (req, res) => {
  const { volunteer_id } = req.params;

  try {
    const records = await Attendance.getAttendanceByVolunteerId(volunteer_id);
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
