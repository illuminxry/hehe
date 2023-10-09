const mysql = require("mysql");

const conn = {
    host: 'localhost',
    database: 'tesstt',
    user: 'root',
    password: ''
};

// exports.getSectionPage = (req, res) => {
//         res.render('section');
// };
exports.getSectionPage = (req, res) => {
    const connection = mysql.createConnection(conn);

    const sql = 'SELECT sectionname FROM section';

    connection.query(sql, (err, rows) => {
        connection.end();

        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Extract section names from the query result
        const sectionNames = rows.map(row => row.sectionname);

        // Pass the sectionNames to the "section" view for rendering
        res.render('section', { sectionNames });
    });
};
exports.postCreateSection = (req, res) => {
    const { sectionname } = req.body;

    // Check if sectionname is provided
    if (!sectionname) {
        res.status(400).send('Section name is required.');
        return;
    }
    const connection = mysql.createConnection(conn);

    const sql = 'INSERT INTO section (sectionname) VALUES (?)';
    const values = [sectionname];

    connection.query(sql, values, (err, result) => {
        connection.end();

        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Section Added');
        console.log('Section Name: ' + sectionname);

        // Redirect to the "section" page or any other appropriate page
        res.redirect('/section');
    });
};