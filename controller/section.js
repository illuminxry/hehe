const mysql = require("mysql");

const conn = {
    host: 'localhost',
    database: 'tesstt',
    user: 'root',
    password: ''
};

// Display section page
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
// Create Section function
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

// Display the section details
exports.viewSection = (req, res) => {
    const sectionname = req.params.sectionname; // Corrected parameter name

    const connection = mysql.createConnection(conn);

    // SQL query to fetch section details by ID
    const sql = `
      SELECT sectionname
      FROM section
      WHERE sectionname = ?
    `;

    connection.query(sql, [sectionname], (err, section) => {
        if (err) {
            console.error('Error fetching section data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.end();

        if (!section || section.length === 0) {
            res.status(404).send('Section not found');
        } else {
            // Pass the section data to a view template for rendering
            res.render('view-section', { section: section[0] });
        }
    });
};

// Update Section Function
exports.updateSection = (req, res) => {
    const oldSectionname = req.params.sectionname; // Get old section name from URL parameter
    const newSectionname = req.body.newSectionname; // Get the updated section name from the form

    const connection = mysql.createConnection(conn);

    // SQL query to update section name
    const sql = `
      UPDATE section
      SET sectionname = ?
      WHERE sectionname = ?
    `;

    connection.query(sql, [newSectionname, oldSectionname], (err, result) => {
        if (err) {
            console.error('Error updating section data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.end();

        if (result.affectedRows === 0) {
            res.status(404).send('Section not found');
        } else {
            console.log('Section updated ' + newSectionname);
            res.redirect('/section'); // Redirect to the updated section
        }
    });
};

// Delete Section Function
exports.deleteSection = (req, res) => {
    const sectionname = req.params.sectionname; // Retrieve the section name from the URL

    const connection = mysql.createConnection(conn);

    // SQL query to delete a section by name
    const sql = `
      DELETE FROM section
      WHERE sectionname = ?
    `;

    connection.query(sql, [sectionname], (err, result) => {
        if (err) {
            console.error('Error deleting section:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.end();

        // Check if any rows were affected (section was deleted)
        if (result.affectedRows === 0) {
            res.status(404).send('Section not found');
        } else {
            // Redirect back to the section list or a success page
            console.log("Successfully deleted: " + sectionname);
            res.redirect('/section'); // You may need to change this URL based on your application's structure
        }
    });
};