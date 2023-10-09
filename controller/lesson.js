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

    const lessonSql = 'SELECT * FROM lesson';

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
            }),
            new Promise((resolve, reject) => {
                connection.query(lessonSql, (err, lessonResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(lessonResults);
                    }
                });
            })
        ])
            .then(([subjectResults, quarterResults, lessonResults]) => {
                connection.end();

                const subjectNames = subjectResults.map(result => result.subjectname);
                const quarterID = quarterResults.map(result => result.quarterID);
                const lessons = lessonResults;

                // Pass subject names and quarterID to the template
                res.render('lesson', { subjectNames, quarterID, lessons });
            })
            .catch(err => {
                console.error('Error fetching data from the database:', err);
                res.status(500).send('Internal Server Error');
            });
    });
};

exports.createLesson = (req, res) => {
    const { lessonid, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, dateCreated, dateAvailableUntil, published } = req.body;

    const connection = mysql.createConnection(conn);

    const sql = 'INSERT INTO lesson (lessonID, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, dateCreated, dateAvailableUntil, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [lessonid, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, dateCreated, dateAvailableUntil, published];
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


exports.editLessonForm = (req, res) => {
    const { id } = req.params;

    Lesson.findById(id, (err, lesson) => {
        if (err) {
            console.error('Error finding lesson:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('edit-lesson', { lesson });
        }
    });
};

exports.viewLesson = (req, res) => {
    const { id } = req.params;

    const connection = mysql.createConnection(conn);

    // SQL query to fetch a single lesson by ID
    const sql = `
      SELECT lessonID, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, dateCreated, dateAvailableUntil, published
      FROM lesson
      WHERE ID = ?
    `;

    connection.query(sql, [id], (err, lesson) => {
        if (err) {
            console.error('Error fetching lesson data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.end();

        if (!lesson || lesson.length === 0) {
            res.status(404).send('Lesson not found');
        } else {
            res.render('view-lesson', { lesson: lesson[0] }); // Assuming you have a "view-lesson" EJS template
        }
    });
};
