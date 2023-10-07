const mysql = require("mysql");

exports.getSubjectList = (req, res) => {
    res.render('subjectlist');
}