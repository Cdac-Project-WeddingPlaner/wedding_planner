const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('config');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
    host: config.get('SERVER'),
    user: config.get('USER'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE')
});

// Create Wedding
router.post('/', (req, res) => {
    // Extract wedding data from the request body
    const weddingData = req.body;

    // Insert wedding details into the 'weddingDetils' table
    pool.query('INSERT INTO weddingDetils SET ?', weddingData, (err, result) => {
        if (err) {
            console.error('Error creating wedding:', err);
            // Handle database insertion error
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Retrieve the inserted wedding ID
        const weddingId = result.insertId;

        // Insert a record into the 'weddingPlanSelections' table referencing the wedding ID
        pool.query(
            'INSERT INTO weddingPlanSelections (wd_id) VALUES (?)',
            [weddingId],
            (err, results) => {
                if (err) {
                    console.error('Error creating wedding plan selection:', err);
                    // Handle second database insertion error
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                // Respond with a 201 status, inserted wedding ID, and wedding data
                res.status(201).json({ weddingId: weddingId, ...weddingData });
            }
        );
    });
});


    // add Wedding
    router.post('/add', authenticateUser, (req, res) => {
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

    // Get Wedding by User ID
    router.get('/user/:userId', authenticateUser, (req, res) => {
        const { userId } = req.params;

        pool.query(`SELECT weddingDetils.* FROM weddingDetils
    INNER JOIN clients ON weddingDetils.client_id=clients.client_id
    WHERE clients.user_id = ?`, [userId], (err, results) => {
            if (err) {
                //         console.error('Error getting wedding by client ID:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.status(200).json(results);
        });
    });


    // Get Wedding by ID
    router.get('/:weddingId', authenticateUser, (req, res) => {
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
