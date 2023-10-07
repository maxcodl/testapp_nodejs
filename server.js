const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '2266',
    database: 'userdb',
    port: 5432,
});


pool.connect(function (err) {
    if (err) {
        console.error("Failed to connect to the database!", err);
    } else {
        console.log("Connected to the database!");
    }
});


app.post('/submitform', function (req, res) {
    const data = req.body;
    const sql = "INSERT INTO users (first_name, last_name, email, address, postcode) VALUES ($1, $2, $3, $4, $5)";
    const values = [data.first_name, data.last_name, data.email, data.address, data.postcode];

    pool
        .query(sql, values)
        .then(() => {
            console.log("Data inserted successfully");
            res.send('Form submitted successfully!');
        })
        .catch((err) => {
            console.error("Failed to insert Data", err);
            if (err.code === "23505" && err.constraint === "users_email_key") {
                res.status(400).send("Email already exists"); // Send a response indicating the email already exists
            } else {
                res.status(500).send('An error occurred');
            }
        });
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});