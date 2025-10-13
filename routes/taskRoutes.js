const express = require('express')
const router = express.Router();
const taskController = require('../controllers/taskController')

router.post('/addTask',taskController.addTask)
router.get('/getTasks',taskController.getTasks)
router.put('/updateTask',taskController.updateTask)
router.delete('/deleteTask',taskController.deleteTask)
module.exports = router