const Task = require('../models/tModel');


const createTask = async (req, res) => {
  try {
    const { project_id,due_date,supervisor_id,title,description,volunteer_id } = req.body;

    if (!project_id || !due_date || !supervisor_id || !title || !description || !volunteer_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const TaskId = await Task.createTask({
      project_id,due_date,supervisor_id,title,description,volunteer_id
    });

    res.status(201).json({ message: "Task created", TaskId });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getTasksByProjects = async (req, res) => {
  try {
    const supervisor_id = req.params.supervisor_id;
    const tasks = await Task.getTasksByProjects(supervisor_id);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const getTasksByVolunteers = async (req, res) => {
  try {
    const volunteer_id = req.params.volunteer_id;
    const tasks = await Task.getTasksByProjects(volunteer_id);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createTask,
  getTasksByProjects,
  getTasksByVolunteers,
};
