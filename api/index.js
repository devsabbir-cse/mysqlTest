const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: "fdb28.awardspace.net",
    user: "4592095_bkash",
    password: "?LCsm2m3L8EfK65",
    database: "4592095_bkash",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// POST API to Insert Data into MySQL
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
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute("SELECT * FROM users");
        connection.release();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

// Export the Express App for Vercel
module.exports = app;
