const mysql = require("mysql");

exports.getSubject = (req, res) => {
    res.render('subject');
}

// exports.postSubject = (req, res) => {

//     const { subjectid, subjectname } = req.body;

//     var sql = 'INSERT INTO `subject` (`subjectid`, `subjectname`) VALUES (?,?)';
//     var values = [subjectid, subjectname];
//     conn.connect(function (err) {
//         conn.query(sql, values, function (err, result) {
//             if (err) throw err;
//             console.log("Subject Added");
//             console.log("subjectID: " + subjectid);
//             console.log("subjectName: " + subjectname);
//             conn.destroy();
//             res.render('index');
//         })
//     });

//     console.error();

// }

exports.postSubject = (req, res) => {
    const { subjectid, subjectname } = req.body;

    const conn = mysql.createConnection({
        host: 'localhost',
        database: 'tesstt',
        user: 'root',
        password: ''
    });

    const sql = 'INSERT INTO subject (subjectid, subjectname) VALUES (?, ?)';
    const values = [subjectid, subjectname];

    conn.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        conn.query(sql, values, (err, result) => {
            conn.end();

            if (err) {
                console.error('Error executing SQL query:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log('Subject Added');
            console.log('subjectID: ' + subjectid);
            console.log('subjectName: ' + subjectname);

            // Redirect to the root URL ('/')
            res.redirect('/');
        });
    });
};


