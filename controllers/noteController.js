const Note = require("../models/notes");
const User = require("../models/user");

// ➕ Add Note
exports.addNote = async (req, res) => {
  try {
    const { note, userId, priority } = req.body;

    if (!note || !userId || !priority) {
      return res.status(400).json({
        status: "failure",
        message: "Required fields (note, userId, priority) are missing",
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }

    const newNote = new Note({
      note,
      userId,
      priority,
    });

    await newNote.save();

    return res.status(201).json({
      status: "Success",
      message: "New Note added successfully",
      data: newNote,
    });
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).json({
      status: "failure",
      message: "Error adding note",
      error: err.message,
    });
  }
};

// 📄 Get Notes
exports.getNotes = async (req, res) => {
  try {
    const { userId, id } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required",
      });
    }

    const filter = { userId };
    if (id) filter._id = id;

    const notes = await Note.find(filter).select("note priority");

    return res.status(200).json({
      status: "Success",
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✏️ Update Note
exports.updateNote = async (req, res) => {
  try {
    const { id, note, priority } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Note ID is required",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { note, priority },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        status: "failure",
        message: "No record found to update",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ❌ Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Note ID is required",
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        status: "failure",
        message: "No note found to delete",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};
