const mysql = require("mysql");
const conn = mysql.createConnection({
    host: 'localhost',
    database: 'tesstt',
    user: 'root',
    password: ''
});

exports.getSubject = (req, res) => {
    res.render('subject');
}

exports.postSubject = (req, res) => {
    const { subjectid, subjectname } = req.body;

    

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

exports.getSubjectView = (req, res) => {
    const { id } = req.params;

    // Query the database to fetch data for the subject with the specified subjectID (id)
    const sql = 'SELECT * FROM subject WHERE subjectID = ?'; // Replace 'subjects' with your table name

    conn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error fetching subject data:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                const subjectData = results[0]; // Assuming you expect only one record
                res.render('view-subject', { subject: subjectData });
            } else {
                res.status(404).send('Subject not found');
            }
        }
    });
};
