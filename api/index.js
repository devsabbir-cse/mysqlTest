const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const pool = mysql.createPool({
    host: "fdb28.awardspace.net",
    user: "4592095_bkash",
    password: "?LCsm2m3L8EfK65",
    database: "4592095_bkash",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 seconds
});

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

// POST API to Insert Data
app.post("/api/data", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        connection.release();
        res.status(200).json({ message: "User added successfully", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

// GET API to Fetch Users
app.get("/api/users", async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page 1, 10 users per page
    const offset = (page - 1) * limit;

    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(
            "SELECT * FROM users LIMIT ? OFFSET ?",
            [parseInt(limit), parseInt(offset)]
        );
        connection.release();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
});


// Export Express App
module.exports = app;
