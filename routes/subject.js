var express = require('express');
var router = express.Router();
const subjectController = require('../controller/subject');
/* GET home page. */
router.get('/subject', subjectController.getSubject);

router.post('/subject', subjectController.postSubject);

module.exports = router;