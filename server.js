const express = require('express');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require('sqlite3').verbose();

// express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// connect to database
const db = new sqlite3.Database('./db/election.db', err =>
{
    if(err)
    {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

// Start server after DB connection
db.on('open', () => 
{
    app.listen(PORT, () =>
    {
        console.log(`Server running on port ${PORT}`);
    });
});

app.get('/', (req, res) =>
{
    res.json(
    {
        message: `Hello World`
    });
});

// Get all candidates
app.get('/api/candidates', (req, res) =>
{
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(`SELECT * FROM candidates`, (err, rows) => 
    {
        if(err)
        {
            res.status(500).json({error: err.message});
            return;
        }

        res.json(
        {
           message: 'success',
           data: rows 
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) =>
{
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => 
    {
        if(err) 
        {
           res.status(400).json({error: err.message});
           return;
        }
        
        res.json(
        {
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) =>
{
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) 
    {
        if (err) 
        {
            res.status(400).json({error: res.message});
            return;
        }

        res.json(
        {
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

// Create a candidate
app.post('/api/candidate', ({body}, res) =>
{
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    
    // ES5 function, not arrow function, to use this
    db.run(sql, params, function(err, result) 
    {
        if (err) 
        {
            res.status(400).json({error: err.message});
            return;
        }

        res.json(
        {
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

app.use((req, res) =>
{
    res.status(404).end();
});