const Project = require('../models/pModel');

const createProject = async (req, res) => {
  try {
    const { name, description, supervisor_id, start_date, end_date } = req.body;

    if (!name || !description ||  !supervisor_id || !start_date || !end_date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const projectId = await Project.createProject({
      name,
      description,
      supervisor_id,
      start_date,
      end_date,
    });

    res.status(201).json({ message: "Project created", projectId });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProjectsBySupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.supervisor_id;
    const projects = await Project.getProjectsBySupervisor(supervisorId);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getTasksByProjects = async (req, res) => {
  try {
    const project_id = req.params.project_id;
    const tasks = await Task.getTasksByProjects(project_id);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createProject,
  getProjectsBySupervisor,
  getTasksByProjects,
};
