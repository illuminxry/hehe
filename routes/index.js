const express = require('express');
const router = express.Router();
const indexController = require('../controller/index'); // Import the controller

/* GET home page. */
router.get('/', indexController.getIndex); // Use the controller for the route

module.exports = router;
