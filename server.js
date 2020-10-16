const express = require('express');
const db = require('./db/database.js');
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes');
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) =>
{
    res.status(404).end();
});

// Start server after DB connection
db.on('open', () => 
{
    app.listen(PORT, () =>
    {
        console.log(`Server running on port ${PORT}`);
    });
});