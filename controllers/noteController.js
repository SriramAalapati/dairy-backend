
const Note = require("../models/Note");
const User = require("../models/user");

exports.addNote = async (req, res) => {
  console.clear();
  console.log("req", req.body);
  const { Note, userId, priority } = req.body;
  if (!Note || !userId || !priority) {
    res
      .status(500)
      .json({ status: "failure", message: "Requires Fields are missing" });
  }
  try {
    const note = await Note.create(req.body);
    res
      .status(201)
      .json({ status: "Success", message: "New Note Added Successfull" });
  } catch (err) {
    res.status(400).json({ status: "failue", message: "Error adding in Note" });
  }
};

exports.getNotes = async (req, res) => {
  const { userId,id=null } = req.query;
  const where  = {userId}
  if(id){
    where.id= id;
  }
  try {
    const Notes = await Note.findAll({
      attributes: ["id", "note"],
      where,
      //   include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    res.status(200).json({
      status: "Success",
      message: "Notes fetched successfully",
      data: Notes || [],
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error,
    });
  }
};

exports.updateNote = async (req, res) => {
  const { id, note } = req.body;
  try {
    const [updatedNote] =await Note.update({ note }, { where: { id } });
    if (updatedNote > 0) {
      res
        .status(200)
        .json({ status: "Success", message: "Note Updated Successfully" });
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



exports.deleteNote = async (req, res) => {
  const { id} = req.body;
  try {
    const deletedNote =await Note.destroy( { where: { id } });
    if (deletedNote > 0) {
      res
        .status(200)
        .json({ status: "Success", message: "Note deleted Successfully" });
    } else {
      res
        .status(404)
        .json({ status: "failure", message: "No Note found to delete" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", message: "Internal server error", error });
  }
};
