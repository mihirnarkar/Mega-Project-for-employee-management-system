const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const cors = require('cors');

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

db.connect((err)=>{
    if(err){
        console.error("Database connection error",err)
    }else{
        console.log("Connected to database");
    }
});

app.use('/home',(req,res)=>{
    res.json("Hi this is done");
})

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to check if the credentials match
    const sql = 'SELECT * FROM employees WHERE Firstname = ?';
    const values = [username];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'An error occurred during login' });
        } else if (results.length === 1) {
            // Check if the password matches
            if (results[0].Dob === password) {
                // Authentication successful
                res.status(200).json({ message: 'Login success' });
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



// Defining a route to handle employee data submission
app.post('/api/employeeData',(req,res)=>{
    const {firstname,lastname,dob,email,address} = req.body;

    const sql = 'INSERT INTO employees(Firstname,Lastname,Email,Dob,Address) VALUES(?,?,?,?,?)';
    const values = [firstname,lastname,email,dob,address];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error('Error inserting data: ',err)
            res.status(500).json({message: 'Error inserting data'})
        }else{
            console.log("Data inserted successfully");
            res.status(200).json({message: 'Data inserted successfully'})
        }
    })
})


// Define a new route to fetch employee data :-
app.get('/api/getemployeeData',(req,res)=>{

    // Define a sql query to select all employees
    const sql = 'SELECT Firstname as firstname, Lastname as lastname, Email as email, Dob as dob, Address as address FROM employees';

    // Execute the query to retrieve all employees
    db.query(sql,(err,result)=>{
        if(err){
            console.error("Error fetching data: ",err);
            res.status(500).json({message: 'Error fetching data'});
        }else{
            console.log('Data fetched successfully');
            console.log(result);
            // res.status(200).json({message: 'Data fetched successfully'});
            res.status(200).json(result);
        }
    });
});


// Define a new route to fetch employee data :-
app.get('/api/employees',(req,res)=>{

    // Define a sql query to select all employees
    const sql = 'SELECT * FROM employees';

    // Execute the query to retrieve all employees
    db.query(sql,(err,result)=>{
        if(err){
            console.error("Error fetching data: ",err);
            res.status(500).json({message: 'Error fetching data'});
        }else{
            console.log('Data fetched successfully');
            console.log(result);
            // res.status(200).json({message: 'Data fetched successfully'});
            res.status(200).json(result);
        }
    });
});


app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})


