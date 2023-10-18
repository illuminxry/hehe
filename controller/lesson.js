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

exports.viewLesson = (req, res) => {
    const { id } = req.params;

    const connection = mysql.createConnection(conn);

    // SQL query to fetch both id and lessonID for a single lesson by ID
    const sql = `
      SELECT ID, lessonID, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, dateCreated, dateAvailableUntil, published
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
            // Pass both id and lesson details to a view template for rendering
            res.render('view-lesson', { id, lesson: lesson[0] });
        }
    });
};

exports.getViewForEdit = (req, res) => {
    const { id } = req.params;

    const connection = mysql.createConnection(conn);

    // SQL query to fetch both id and lessonID for a single lesson by ID
    const sql = `
      SELECT ID, lessonID, subjectname, quarterID, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, dateCreated, dateAvailableUntil, published
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
            // Pass both id and lesson details to a view template for rendering
            res.render('edit-lesson', { id, lesson: lesson[0] });
        }
    });
};

exports.editLesson = (req, res) => {
    const id = req.params.id;
    const updatedLessonData = req.body;
    const connection = mysql.createConnection(conn);

    // SQL query to update the lesson data based on lessonID
    const updateSql = `
  UPDATE lesson
  SET
    lessonID = ?,
    subjectname = ?,
    quarterID = ?,
    section1 = ?,
    section2 = ?,
    section3 = ?,
    section4 = ?,
    section5 = ?,
    section6 = ?,
    section7 = ?,
    section8 = ?,
    section9 = ?,
    section10 = ?,
    dateCreated = ?,
    dateAvailableUntil = ?,
    published = ?
  WHERE ID = ?
`;

    connection.query(
        updateSql,
        [
            updatedLessonData.lessonID,
            updatedLessonData.subjectname,
            updatedLessonData.quarterID,
            updatedLessonData.section1,
            updatedLessonData.section2,
            updatedLessonData.section3,
            updatedLessonData.section4,
            updatedLessonData.section5,
            updatedLessonData.section6,
            updatedLessonData.section7,
            updatedLessonData.section8,
            updatedLessonData.section9,
            updatedLessonData.section10,
            updatedLessonData.dateCreated,
            updatedLessonData.dateAvailableUntil,
            updatedLessonData.published,
            id // Use the id from the URL parameter
        ],
        (err, result) => {
            connection.end();

            if (err) {
                console.error('Error updating lesson:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log('Lesson updated successfully');
            // Redirect to the lesson details page or any other appropriate page
            res.redirect('/lesson'); // redirect to view lesson page
        }
    );
};

exports.deleteLesson = (req, res) => {
    const { id } = req.params.id;

    // Implement the SQL query to delete the lesson with the specified ID
    const deleteSql = 'DELETE FROM lesson WHERE ID = ?';

    const connection = mysql.createConnection(conn);

    connection.query(deleteSql, [id], (err, result) => {
        connection.end();

        if (err) {
            console.error('Error deleting lesson:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Lesson deleted successfully');
        // Redirect to a relevant page, e.g., the list of lessons
        res.redirect('/lesson');
    });
};
