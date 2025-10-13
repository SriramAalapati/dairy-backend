const dashboardController =require('../controllers/dashboardController');
const express = require('express')
const router = express.Router()

router.get('/getDashboardData',dashboardController.getDashboardStats)

module.exports = router
