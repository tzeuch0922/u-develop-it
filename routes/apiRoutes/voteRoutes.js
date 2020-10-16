const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');
const inputCheck = require('../../utils/inputCheck.js');

router.post('/vote', ({body}, res) =>
{
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if(errors)
    {
        res.status(400).send({error: errors});
        return;
    }
    const sql = 'INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)';
    const params = [body.voter_id, body.candidate_id];
    db.run(sql, params, (err, result) =>
    {
        if(err)
        {
            res.status(500).json({error: err});
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

router.get('/votes', (req, res) =>
{
    const sql = "SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count FROM votes LEFT JOIN candidates ON votes.candidate_id = candidates.id LEFT JOIN parties ON candidates.party_id = parties.id GROUP BY candidate_id ORDER BY count DESC";
    db.all(sql, (err, rows) =>
    {
        if(err)
        {
            res.status(500).json({error: err});
            return;
        }
        res.json(
        {
            message: 'success',
            data: rows
        });
    });
});
module.exports = router;