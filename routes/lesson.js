const express = require('express');
const router = express.Router();
const lessonController = require('../controller/lesson'); // Import the controller

/* GET home page. */
router.get('/lesson', lessonController.getLesson); // Use the controller for the route
router.post('/lesson', lessonController.createLesson);

router.get('/lesson/view-lesson/:id', lessonController.viewLesson);
router.get('/lesson/edit/:id', lessonController.getViewForEdit);
router.post('/lesson/edit/:id', lessonController.editLesson);

router.post('/lesson/delete/:id', lessonController.deleteLesson);

module.exports = router;
