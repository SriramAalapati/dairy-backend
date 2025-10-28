const Task = require("../models/task");

// ➤ Add Task
exports.addTask = async (req, res) => {
  console.clear();
  console.log("req", req.body);
  
  const { task, userId, priority } = req.body;

  if (!task || !userId || !priority) {
    return res.status(400).json({
      status: "failure",
      message: "Required fields are missing",
    });
  }

  try {
    const newTask = await Task.create({ task, userId, priority });
    res.status(201).json({
      status: "success",
      message: "New task added successfully",
      data: newTask,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "Error adding task",
      error: err.message,
    });
  }
};

// ➤ Get Tasks
exports.getTasks = async (req, res) => {
  const { userId, id = null } = req.query;

  if (!userId) {
    return res.status(400).json({
      status: "failure",
      message: "userId is required",
    });
  }

  try {
    const query = { userId };
    if (id) query._id = id;

    const tasks = await Task.find(query).select("task priority userId");

    res.status(200).json({
      status: "success",
      message: "Tasks fetched successfully",
      data: tasks || [],
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ➤ Update Task
exports.updateTask = async (req, res) => {
  const { id, task, priority } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "failure",
      message: "Task ID is required",
    });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task, priority },
      { new: true }
    );

    if (updatedTask) {
      res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        data: updatedTask,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "No record found to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ➤ Delete Task
exports.deleteTask = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "failure",
      message: "Task ID is required",
    });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (deletedTask) {
      res.status(200).json({
        status: "success",
        message: "Task deleted successfully",
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "No task found to delete",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};
