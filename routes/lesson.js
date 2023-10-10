const express = require('express');
const router = express.Router();
const lessonController = require('../controller/lesson'); // Import the controller

/* GET home page. */
router.get('/lesson', lessonController.getLesson); // Use the controller for the route
router.post('/lesson', lessonController.createLesson);

router.get('/lesson/view/:id', lessonController.viewLesson);
// router.post('/lesson/edit/:id', lessonController.editLesson);
router.post('/lesson/edit/:id', lessonController.editLesson);
module.exports = router;
