const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 👇 Define clean and RESTful endpoints        
router.get("/:id", userController.getUser);          // 🔍 Get single user by ID
router.put("/:id", userController.updateUser);       // ✏️ Update user by ID
router.delete("/:id", userController.deleteUser);    // ❌ Delete user by ID

module.exports = router;
