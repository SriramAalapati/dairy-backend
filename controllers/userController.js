const User = require("../models/user");
const bcrypt = require("bcryptjs");
// ✅ Utility for standard responses
const sendResponse = (res, status, message, data = null, code = 200) => {
  res.status(code).json({
    status,
    message,
    data,
  });
};


// ➤ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    sendResponse(res, "success", "Users fetched successfully", users);
  } catch (err) {
    sendResponse(res, "failure", `Error fetching users: ${err.message}`, null, 500);
  }
};

// ➤ Get single user by ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) return sendResponse(res, "failure", "User not found", null, 404);

    sendResponse(res, "success", "User fetched successfully", user);
  } catch (err) {
    sendResponse(res, "failure", `Error fetching user: ${err.message}`, null, 500);
  }
};

// ➤ Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!user) return sendResponse(res, "failure", "User not found", null, 404);

    sendResponse(res, "success", "User updated successfully", user);
  } catch (err) {
    sendResponse(res, "failure", `Error updating user: ${err.message}`, null, 500);
  }
};

// ➤ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return sendResponse(res, "failure", "User not found", null, 404);

    sendResponse(res, "success", "User deleted successfully");
  } catch (err) {
    sendResponse(res, "failure", `Error deleting user: ${err.message}`, null, 500);
  }
};
