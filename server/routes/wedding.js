const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('config');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
    host: config.get('SERVER'),
    user: config.get('USER'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE')
});

// Create Wedding
router.post('/', authenticateUser, (req, res) => {
    // Check if the authenticated user is a client
    if (req.user_type !== 'client') {
        return res.status(403).json({ error: 'Forbidden. Client access required.' });
    }

    const weddingData = req.body;

    pool.query('INSERT INTO weddingDetils SET ?', weddingData, (err, result) => {
        if (err) {
            console.error('Error creating wedding:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(201).json({ weddingId: result.insertId, ...weddingData });
    });
});


// Get All Weddings
router.get('/', authenticateUser, (req, res) => {
    // Check if the authenticated user is an admin
    if (req.user_type !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }

    pool.query('SELECT * FROM weddingDetils', (err, results) => {
        if (err) {
           // console.error('Error getting all weddings:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json(results);
    });
});


// Get Wedding by Client ID
router.get('/client/:clientId', authenticateUser, (req, res) => {
    const { clientId } = req.params;

    pool.query('SELECT * FROM weddingDetils WHERE client_id = ?', [clientId], (err, results) => {
        if (err) {
   //         console.error('Error getting wedding by client ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json(results);
    });
});


// Get Wedding by ID
router.get('/:weddingId', authenticateUser,(req, res) => {
    const { weddingId } = req.params;

    pool.query('SELECT * FROM weddingDetils WHERE wd_id = ?', [weddingId], (err, results) => {
        if (err) {
            console.error('Error getting wedding by ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Wedding not found' });
            return;
        }

        res.status(200).json(results[0]);
    });
});

// Update Wedding by ID
router.put('/:weddingId', authenticateUser, (req, res) => {
    // Check if the authenticated user is a client
    if (req.user_type !== 'client') {
        return res.status(403).json({ error: 'Forbidden. Client access required.' });
    }

    const { weddingId } = req.params;
    const updatedData = req.body;

    pool.query('UPDATE weddingDetils SET ? WHERE wd_id = ?', [updatedData, weddingId], (err) => {
        if (err) {
            console.error('Error updating wedding by ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json({ message: 'Wedding updated' });
    });
});

// Delete Wedding by ID
router.delete('/:weddingId', authenticateUser, (req, res) => {
    // Check if the authenticated user is a client
    if (req.user_type !== 'client') {
        return res.status(403).json({ error: 'Forbidden. Client access required.' });
    }

    const { weddingId } = req.params;

    pool.query('DELETE FROM weddingDetils WHERE wd_id = ?', [weddingId], (err) => {
        if (err) {
            console.error('Error deleting wedding by ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json({ message: 'Wedding deleted' });
    });
});


module.exports = router;
