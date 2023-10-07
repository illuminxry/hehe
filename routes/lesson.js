const express = require('express');
const router = express.Router();
const lessonController = require('../controller/lesson'); // Import the controller

/* GET home page. */
router.get('/lesson', lessonController.getLesson); // Use the controller for the route
router.get('/create-lesson', lessonController.postLesson);

module.exports = router;
