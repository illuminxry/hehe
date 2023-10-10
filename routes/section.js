const express = require('express');
const router = express.Router();
const sectionController = require('../controller/section');

router.get('/section', sectionController.getSectionPage);

router.post('/create-section', sectionController.postCreateSection);

router.get('/section/view/:sectionname', sectionController.viewSection);

router.post('/section/update/:sectionname', sectionController.updateSection);

router.get('/section/delete/:sectionname', sectionController.deleteSection);
module.exports = router;