const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
    host: config.get('SERVER'),
    user: config.get('USER'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE')
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.query(
        'SELECT user_id, first_name, last_name, user_type FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 1) {
                const user = results[0];

                // Generate a JWT token
                const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, config.get('jwtSecret'), {
                    expiresIn: '1h'  // Token expiration time, adjust as needed
                });

                // Return user details and token upon successful login
                res.status(200).json({
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_type: user.user_type,
                    token: token
                });
            } else {
                // Incorrect credentials
                res.status(401).send('Invalid email or password');
            }
        }
    );
});


// Register as a vendor route
router.post('/register/vendor', (req, res) => {
    const {
        email,
        password,
        first_name,
        middle_name,
        last_name,
        phone_number,
        address,
        service_type,
        business_name,
        contact_email,
        altarnet_number,
        business_address,
        logo_image_url,
        description,
        is_verified
    } = req.body;

    pool.query(
        'INSERT INTO users (email, password, first_name, middle_name, last_name, phone_number, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [email, password, first_name, middle_name, last_name, phone_number, address, 'vendor'],
        (err, userResults) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Get the inserted user's ID
            const user_id = userResults.insertId;

            // Create a vendor entry
            pool.query(
                'INSERT INTO vendors (user_id, service_type, business_name, contact_email, altarnet_number, business_address, logo_image_url, description, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id, service_type, business_name, contact_email, altarnet_number, business_address, logo_image_url, description, is_verified],
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    res.status(201).send('Vendor registration successful');
                }
            );
        }
    );
});


// Register as a client route
router.post('/register/client', (req, res) => {
    const { email, password, first_name, last_name, phone_number, address, avatar_image_url } = req.body;

    pool.query(
        'INSERT INTO users (email, password, first_name, last_name, phone_number, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, password, first_name, last_name, phone_number, address, 'client'],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Get the inserted user's ID
            const user_id = results.insertId;

            // Create a client entry
            pool.query(
                'INSERT INTO clients (user_id, avetar_image_url) VALUES (?, ?)',
                [user_id, avatar_image_url],
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    res.status(201).send('Client registration successful');
                }
            );
        }
    );
});


// Change Password route
router.post('/change-password', authenticateUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user_id;

        // Fetch the user's current password from the database
        pool.query('SELECT password FROM users WHERE user_id = ?', [userId], async (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 1) {
                const user = results[0];

                // Verify the old password
                if (oldPassword === user.password) {
                    // Update the user's password in the database (storing the plain text password)
                    pool.query('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, userId], (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        res.status(200).send('Password changed successfully');
                    });
                } else {
                    // Old password does not match
                    res.status(401).send('Invalid old password');
                }
            } else {
                // User not found
                res.status(404).send('User not found');
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
