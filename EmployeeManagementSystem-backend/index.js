const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const cors = require('cors');

// using json web token:-
const jwt = require('jsonwebtoken');

// Sample secret key for jwt:-
const secretKey = 'srushti';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyparser.json());

// Creating a mysql database connection:-
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mihirsql',
    database: 'employee_management',
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error", err)
    } else {
        console.log("Connected to database");
    }
});

// Middleware to verify jwt token:-
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token invalid" });
        }

        // Token is valid you can access the user information from 'decoded.sub' and 'decoded.username'
        req.userId = decoded.sub;
        next();
    })
}

// Home endpoint:
app.use('/home', (req, res) => {
    res.json("Hi, this is done");
})

// Login endpoint:
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to check if the credentials match
    const sql = 'SELECT * FROM employees WHERE Firstname = ?';
    const values = [username];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Username/password doesnt match' });
        } else if (results.length === 1) {
            // Check if the password matches
            if (results[0].Dob === password) {

                // Authentication successful, generate the jwt token
                const token = jwt.sign({ sub: results[0].id, username: username }, secretKey, {
                    expiresIn: '1h', // token expiration time
                });

                res.status(200).json({ message: 'Login success', token })

            } else {
                // Authentication failed
                res.status(401).json({ message: 'Login failed' });
            }
        } else {
            // No user found with the provided username
            res.status(401).json({ message: 'Login failed' });
        }
    });
});

// Employee data submission endpoint:
app.post('/api/employeeData', (req, res) => {
    const { firstname, lastname, contactno, email, dob, address } = req.body;

    const sql = 'INSERT INTO employees(Firstname, Lastname, Contactno, Email, Dob, Address) VALUES(?,?,?,?,?,?)';
    const values = [firstname, lastname, contactno, email, dob, address];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err)
            res.status(500).json({ message: 'Error inserting data' })
        } else {
            console.log("Data inserted successfully");
            res.status(200).json({ message: 'Data inserted successfully' })
        }
    })
});

// Check if email exists endpoint:
app.get('/api/checkEmailExists/:firstname/:email', (req, res) => {
    const email = req.params.email;
    const firstname = req.params.firstname;

    // Query the database to check if the email already exists
    const sql = 'SELECT COUNT(*) AS count FROM employees WHERE Email = ? OR Firstname = ?';
    const values = [email,firstname];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error checking email:", err);
            res.status(500).json({ message: 'Error checking email' });
        } else {
            const count = result[0].count;
            res.status(200).json(count > 0); // Return true if email exists, false otherwise
        }
    });
});

// Update employee endpoint:
app.put('/api/updateEmployee/:email', (req, res) => {
    const email = req.params.email;
    const { firstname, lastname, contactno, dob, address } = req.body;

    // Query the database to update the employee
    const sql = 'UPDATE employees SET Firstname=?, Lastname=?, Contactno=?, Dob=?, Address=? WHERE Email=?';
    const values = [firstname, lastname, contactno, dob, address, email];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            res.status(500).json({ message: "Error updating data" });
        } else {
            console.log(`${email} updated successfully`);
            res.status(200).json({ message: `${email} updated successfully` });
        }
    });
});

// Get employee data using middleware endpoint:
app.get('/api/getemployeeData', (req, res) => {

    // Define an SQL query to select all employees
    const sql = 'SELECT Firstname as firstname, Lastname as lastname, Email as email, Dob as dob, Address as address, Contactno as contactno FROM employees';

    // Execute the query to retrieve all employees
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching data: ", err);
            res.status(500).json({ message: 'Error fetching data' });
        } else {
            console.log('Data fetched successfully');
            res.status(200).json(result);
        }
    });
});

// Delete employee endpoint
app.delete('/api/deleteEmployee/:email', (req, res) => {
    const email = req.params.email;

    // Defining an SQL query to delete an employee by email
    const sql = 'DELETE FROM employees WHERE Email = ?';
    const values = [email];

    // Execute the query to delete an employee
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            res.status(500).json({ message: "Error deleting data" });
        } else if (result.affectedRows === 0) {
            // If no rows were affected, it means the email was not found
            console.log(`Email ${email} not found`);
            res.status(404).json({ message: `${email} does not exist` });
        } else {
            console.log(`${email} deleted successfully`);
            res.status(200).json({ message: `${email} deleted successfully` });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
