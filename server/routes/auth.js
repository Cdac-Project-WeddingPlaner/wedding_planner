const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
    host: config.get('SERVER'),
    user: config.get('USER'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE')
});

const USER_TYPE_VENDOR = 'vendor';
const USER_TYPE_CLIENT = 'client';

// Multer Configuration
const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, `uploads/logos`));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, `uploads/avatars`));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadlogo = multer({ storage: storage1 });
const uploadavtars = multer({ storage: storage2 });

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT user_id, first_name, last_name, user_type, password FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (results.length === 1) {
            const user = results[0];
            bcrypt.compare(password, user.password, (bcryptError, isPasswordMatch) => {
                if (bcryptError) {
                    console.error(bcryptError);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                if (isPasswordMatch) {
                    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, config.get('jwtSecret'), {
                        expiresIn: '1h'
                    });

                    res.status(200).json({
                        user_id: user.user_id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        user_type: user.user_type,
                        token: token
                    });
                } else {
                    res.status(401).json({ error: 'Invalid email or password' });
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// Register as a vendor route
router.post('/register/vendor', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('service_type').notEmpty(),
    check('business_name').notEmpty(),
    check('contact_email').isEmail(),
    check('altarnet_number').notEmpty(),
    check('business_address').notEmpty(),
    check('description').notEmpty(),
], uploadlogo.single('logo_image_url'), (req, res) => {
    const {
        email, password, first_name, middle_name, last_name, phone_number, address,
        service_type, business_name, contact_email, altarnet_number, business_address,
        description
    } = req.body;

    const logoImageFile = req.file;

    // Ensure a file was uploaded
    if (!logoImageFile) {
        return res.status(400).json({ error: 'Logo image is required' });
    }

    const logoImageName = logoImageFile.filename;  // Use only the file name with extension

    // Start a transaction
    pool.getConnection((connectionError, connection) => {
        if (connectionError) {
            console.error(connectionError);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        connection.beginTransaction((transactionError) => {
            if (transactionError) {
                console.error(transactionError);
                res.status(500).json({ error: 'Internal Server Error' });
                return connection.rollback(() => {
                    connection.release();
                });
            }

            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error(hashError);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return connection.rollback(() => {
                        connection.release();
                    });
                }

                connection.query(
                    'INSERT INTO users (email, password, first_name, middle_name, last_name, phone_number, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [email, hashedPassword, first_name, middle_name, last_name, phone_number, address, USER_TYPE_VENDOR],
                    (userError, userResults) => {
                        if (userError) {
                            // Handle unique constraint violation (duplicate email)
                            if (userError.code === 'ER_DUP_ENTRY') {
                                console.error('Email already exists:', email);
                                res.status(400).json({ error: 'Email already exists' });
                            } else {
                                console.error(userError);
                                res.status(500).json({ error: 'Internal Server Error' });
                            }

                            return connection.rollback(() => {
                                connection.release();
                            });
                        }

                        const user_id = userResults.insertId;

                        connection.query(
                            'INSERT INTO vendors (user_id, service_type, business_name, contact_email, altarnet_number, business_address, logo_image_url, description, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [user_id, service_type, business_name, contact_email, altarnet_number, business_address, logoImageName, description, 0],
                            (vendorError) => {
                                if (vendorError) {
                                    console.error(vendorError);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                    return connection.rollback(() => {
                                        connection.release();
                                    });
                                }

                                // Commit the transaction
                                connection.commit((commitError) => {
                                    if (commitError) {
                                        console.error(commitError);
                                        res.status(500).json({ error: 'Internal Server Error' });
                                        return connection.rollback(() => {
                                            connection.release();
                                        });
                                    }

                                    res.status(201).json({ message: 'Vendor registration successful' });

                                    // Release the connection after a successful commit
                                    connection.release();
                                });
                            }
                        );
                    }
                );
            });
        });
    });
});


// Register as a client route
router.post('/register/client', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    // ... (other validation checks)
], uploadavtars.single('avatar_image_url'), (req, res) => {
    const {
        email, password, first_name, last_name, phone_number, address
    } = req.body;

    const avatarImagePath = req.file ? req.file.path : null;

    // Start a transaction
    pool.getConnection((connectionError, connection) => {
        if (connectionError) {
            console.error(connectionError);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        connection.beginTransaction((transactionError) => {
            if (transactionError) {
                console.error(transactionError);
                res.status(500).json({ error: 'Internal Server Error' });
                return connection.rollback(() => {
                    connection.release();
                });
            }

            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error(hashError);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return connection.rollback(() => {
                        connection.release();
                    });
                }

                connection.query(
                    'INSERT INTO users (email, password, first_name, last_name, phone_number, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [email, hashedPassword, first_name, last_name, phone_number, address, USER_TYPE_CLIENT],
                    (userError, results) => {
                        if (userError) {
                            // Handle unique constraint violation (duplicate email)
                            if (userError.code === 'ER_DUP_ENTRY') {
                                console.error('Email already exists:', email);
                                res.status(400).json({ error: 'Email already exists' });
                            } else {
                                console.error(userError);
                                res.status(500).json({ error: 'Internal Server Error' });
                            }

                            return connection.rollback(() => {
                                connection.release();
                            });
                        }

                        const user_id = results.insertId;

                        connection.query(
                            'INSERT INTO clients (user_id, avatar_image_url) VALUES (?, ?)',
                            [user_id, avatarImagePath],
                            (clientError) => {
                                if (clientError) {
                                    console.error(clientError);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                    return connection.rollback(() => {
                                        connection.release();
                                    });
                                }

                                // Commit the transaction
                                connection.commit((commitError) => {
                                    if (commitError) {
                                        console.error(commitError);
                                        res.status(500).json({ error: 'Internal Server Error' });
                                        return connection.rollback(() => {
                                            connection.release();
                                        });
                                    }

                                    res.status(201).json({ message: 'Client registration successful' });

                                    // Release the connection after a successful commit
                                    connection.release();
                                });
                            }
                        );
                    }
                );
            });
        });
    });
});

// Change Password route
router.post('/change-password', authenticateUser, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user_id;

    pool.query('SELECT password FROM users WHERE user_id = ?', [userId], (queryError, results) => {
        if (queryError) {
            console.error(queryError);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (results.length === 1) {
            const user = results[0];
            bcrypt.compare(oldPassword, user.password, (bcryptError, isPasswordMatch) => {
                if (bcryptError) {
                    console.error(bcryptError);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                if (isPasswordMatch) {
                    bcrypt.hash(newPassword, 10, (hashError, hashedNewPassword) => {
                        if (hashError) {
                            console.error(hashError);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }

                        pool.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedNewPassword, userId], (updateError) => {
                            if (updateError) {
                                console.error(updateError);
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }

                            res.status(200).json({ message: 'Password changed successfully' });
                        });
                    });
                } else {
                    res.status(401).json({ error: 'Invalid old password' });
                }
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

module.exports = router;
