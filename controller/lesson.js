const mysql = require("mysql");

const conn = {
    host: 'localhost',
    database: 'tesstt',
    user: 'root',
    password: ''
};

exports.getLesson = (req, res) => {
    const connection = mysql.createConnection(conn);

    // SQL query to fetch subject names from the "subject" table
    const subjectSql = 'SELECT subjectname FROM subject'; // Modify the table name as needed

    // SQL query to fetch quarterPeriod values from the "quarters" table
    const quarterSql = 'SELECT quarterID FROM quarter'; // Modify the table name as needed

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Execute both SQL queries in parallel using Promise.all
        Promise.all([
            new Promise((resolve, reject) => {
                connection.query(subjectSql, (err, subjectResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(subjectResults);
                    }
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(quarterSql, (err, quarterResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(quarterResults);
                    }
                });
            })
        ])
            .then(([subjectResults, quarterResults]) => {
                connection.end();

                const subjectNames = subjectResults.map(result => result.subjectname);
                const quarterID = quarterResults.map(result => result.quarterID);

                // Pass subject names and quarterID to the template
                res.render('lesson', { subjectNames, quarterID });
            })
            .catch(err => {
                console.error('Error fetching data from the database:', err);
                res.status(500).send('Internal Server Error');
            });
    });
};

exports.createLesson = (req, res) => {
    const { lessonid, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10 } = req.body;

    const connection = mysql.createConnection(conn);

    const sql = 'INSERT INTO lesson (lessonID, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [lessonid, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Lesson Added');
        console.log('lessonid: ' + lessonid);
        console.log('subjectName: ' + subjectname);
        connection.end();

        // Redirect to the root URL ('/')
        res.redirect('/lesson');
    });
};
