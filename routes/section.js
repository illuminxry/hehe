const express = require('express');
const router = express.Router();
const sectionController = require('../controller/section');

router.get('/section', sectionController.getSectionPage);

router.post('/create-section', sectionController.postCreateSection);

module.exports = router;