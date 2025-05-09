const db = require('../config/db');

const createProject = async ({ name, description,supervisor_id, start_date,end_date  }) => {
  const [result] = await db.query(
    `INSERT INTO projects (name, description,supervisor_id, start_date,end_date ) VALUES (?, ?, ?, ?, ?)`,
    [name, description,supervisor_id, start_date,end_date ]
  );
  return result.insertId;
};

const getProjectsBySupervisor = async (supervisor_id) => {
  const [projects] = await db.query(
    `SELECT * FROM projects WHERE supervisor_id = ?`,
    [supervisor_id]
  );
  return projects;
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
