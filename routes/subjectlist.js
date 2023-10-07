var express = require('express');
var router = express.Router();
const subjectlistController = require('../controller/subjectlist');

router.get('/subjectlist', subjectlistController.getSubjectList);


module.exports = router;