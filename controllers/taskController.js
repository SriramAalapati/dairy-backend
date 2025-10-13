
const Task = require("../models/task");
const User = require("../models/user");
exports.addTask = async (req, res) => {
  console.clear();
  console.log("req", req.body);
  const { task, userId, priority } = req.body;
  if (!task || !userId || !priority) {
    res
      .status(500)
      .json({ status: "failure", message: "Requires Fields are missing" });
  }
  try {
    const task = await Task.create(req.body);
    res
      .status(201)
      .json({ status: "Success", message: "New Task Added Successfull" });
  } catch (err) {
    res.status(400).json({ status: "failue", message: "Error adding in task" });
  }
};

exports.getTasks = async (req, res) => {
  const { userId,id=null } = req.query;
  const where  = {userId}
  if(id){
    where.id= id;
  }
  try {
    const tasks = await Task.findAll({
      attributes: ["id", "task", "priority"],
      where,
      //   include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    res.status(200).json({
      status: "Success",
      message: "Tasks fetched successfully",
      data: tasks || [],
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error,
    });
  }
};

exports.updateTask = async (req, res) => {
  const { id, task, priority } = req.body;
  try {
    const [updatedTask] =await Task.update({ task, priority }, { where: { id } });
    if (updatedTask > 0) {
      res
        .status(200)
        .json({ status: "Success", message: "Task Updated Successfully" });
    } else {
      res
        .status(404)
        .json({ status: "failure", message: "No record found to update" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", message: "Internal server error", error });
  }
};



exports.deleteTask = async (req, res) => {
  const { id} = req.body;
  try {
    const deletedTask =await Task.destroy( { where: { id } });
    if (deletedTask > 0) {
      res
        .status(200)
        .json({ status: "Success", message: "Task deleted Successfully" });
    } else {
      res
        .status(404)
        .json({ status: "failure", message: "No task found to delete" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", message: "Internal server error", error });
  }
};
