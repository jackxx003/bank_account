const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🛠️ MySQL Connection Setup (Modified for Render & Localhost)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'root123', 
    database: process.env.DB_NAME || 'banking_db',
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL Connected successfully...');
});

// 1. Create Account API
app.post('/api/create-account', (req, res) => {
    const { bank, name, accNo, amount } = req.body;
    const sql = "INSERT INTO accounts (bank_name, account_no, customer_name, balance) VALUES (?, ?, ?, ?)";
    db.query(sql, [bank, accNo, name, amount], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Account Created", accNo });
    });
});

// 2. Deposit API
app.post('/api/deposit', (req, res) => {
    const { accNo, amount } = req.body;
    const sql = "UPDATE accounts SET balance = balance + ? WHERE account_no = ?";
    db.query(sql, [amount, accNo], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Deposit Success" });
    });
});

// 3. Get Balance / Dashboard Stats API
app.get('/api/accounts', (req, res) => {
    db.query("SELECT * FROM accounts ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// 🛠️ Port setup (Modified: Render dynamic port or default 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));