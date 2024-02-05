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

// Get all clients with user information using the ClientView
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM ClientView';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Get a specific client by ID with user information using the ClientView
router.get('/:client_id', (req, res) => {
    const clientId = req.params.client_id;

    const sql = 'SELECT * FROM ClientView WHERE client_id = ?';

    pool.query(sql, [clientId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 1) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Client not found');
        }
    });
});

// Update a client by ID with user information
router.put('/:client_id', (req, res) => {
    const clientId = req.params.client_id;
    const { email, password, phone_number, first_name, last_name, address } = req.body;

    const updateUserSql = `
        UPDATE users
        SET email=?, phone_number=?, first_name=?, last_name=?, address=?
        WHERE user_id = (SELECT user_id FROM clients WHERE client_id = ?);
    `;

    const updateClientSql = 'UPDATE clients SET user_id = user_id WHERE client_id = ?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Update user information
            connection.query(updateUserSql, [email, phone_number, first_name, last_name, address, clientId], (err, userResults) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    });
                }

                // Update client information
                connection.query(updateClientSql, [clientId], (err, clientResults) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        });
                    }

                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error(err);
                                res.status(500).send('Internal Server Error');
                            });
                        }

                        connection.release();
                        res.status(200).send('Client updated successfully');
                    });
                });
            });
        });
    });
});



module.exports = router;
