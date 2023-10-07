const mysql = require("mysql");

exports.getIndex = (req, res) => {
    const conn = mysql.createConnection({
        host: 'localhost',
        database: 'tesstt',
        user: 'root',
        password: ''
    });

    const sql = 'SELECT * FROM subject ORDER BY subjectid ASC'; // Updated SQL query with ORDER BY

    conn.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        conn.query(sql, (err, results) => {
            conn.end();

            if (err) {
                console.error('Error executing SQL query:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.render('index', { subjects: results }); // Pass the results to the 'index' view
        });
    });
};
