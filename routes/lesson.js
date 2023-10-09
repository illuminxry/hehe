const express = require('express');
const router = express.Router();
const lessonController = require('../controller/lesson'); // Import the controller

/* GET home page. */
router.get('/lesson', lessonController.getLesson); // Use the controller for the route
router.post('/lesson', lessonController.createLesson);

// Display the form for editing a lesson
// router.get('/lessons/:id/edit', lessonController.editLessonForm);

// // Handle the update of a lesson
// router.post('/lessons/:id/edit', lessonController.updateLesson);

// // Handle the deletion of a lesson
// router.post('/lessons/:id/delete', lessonController.deleteLesson);

router.get('/lesson/view/:id', lessonController.viewLesson);
module.exports = router;
