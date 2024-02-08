const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
    host: config.get('SERVER'),
    user: config.get('USER'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE')
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination folder for uploads
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // Specify a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer upload for avatar images
const avatarUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit the file size to 5MB (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        // Add your file type validation logic here if needed
        cb(null, true);
    }
}).single('avatar_image');

// Multer upload for logo images
const logoUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit the file size to 5MB (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        // Add your file type validation logic here if needed
        cb(null, true);
    }
}).single('logo_image');

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
                res.status(401).send('Invalid email or password');
            }
        }
    );
});

// Register as a vendor route
router.post('/register/vendor', logoUpload, async (req, res) => {
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
        description,
        is_verified
    } = req.body;

    const logoImage = req.file;

    if (!logoImage) {
        res.status(400).send('Logo image is required');
        return;
    }

    const logoImageUrl = `uploads/${logoImage.filename}`;

    try {
        // Start a transaction
        await pool.beginTransaction();

        // Insert into the 'users' table
        const userInsertResult = await pool.query(
            'INSERT INTO users (email, password, first_name, middle_name, last_name, phone_number, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [email, password, first_name, middle_name, last_name, phone_number, address, 'vendor']
        );

        const user_id = userInsertResult.insertId;

        // Insert into the 'vendors' table
        await pool.query(
            'INSERT INTO vendors (user_id, service_type, business_name, contact_email, altarnet_number, business_address, logo_image_url, description, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, service_type, business_name, contact_email, altarnet_number, business_address, logoImageUrl, description, is_verified]
        );

        // Commit the transaction
        await pool.commit();

        res.status(201).send('Vendor registration successful');
    } catch (error) {
        console.error(error);

        // Rollback the transaction if an error occurs
        await pool.rollback();

        res.status(500).send('Internal Server Error');
    }
});


// Register as a client route
router.post('/register/client', avatarUpload, async (req, res) => {
    const { email, password, first_name, last_name, phone_number, address } = req.body;
    const avatarImage = req.file;

    if (!avatarImage) {
        res.status(400).send('Avatar image is required');
        return;
    }

    const avatarImageUrl = `uploads/${avatarImage.filename}`;

    try {
        // Start a transaction
        await pool.beginTransaction();

        // Insert into the 'users' table
        const userInsertResult = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, phone_number, address, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, phone_number, address, 'client']
        );

        const user_id = userInsertResult.insertId;

        // Insert into the 'clients' table
        await pool.query(
            'INSERT INTO clients (user_id, avatar_image_url) VALUES (?, ?)',
            [user_id, avatarImageUrl]
        );

        // Commit the transaction
        await pool.commit();

        res.status(201).send('Client registration successful');
    } catch (error) {
        console.error(error);

        // Rollback the transaction if an error occurs
        await pool.rollback();

        res.status(500).send('Internal Server Error');
    }
});

// Change Password route
router.post('/change-password', authenticateUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user_id;

        // Start a transaction
        await pool.beginTransaction();

        // Fetch the user's current password from the database
        const passwordResults = await pool.query('SELECT password FROM users WHERE user_id = ?', [userId]);

        if (passwordResults.length === 1) {
            const user = passwordResults[0];

            // Verify the old password
            if (oldPassword === user.password) {
                // Update the user's password in the database
                await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, userId]);

                // Commit the transaction
                await pool.commit();

                res.status(200).send('Password changed successfully');
            } else {
                // Old password does not match
                res.status(401).send('Invalid old password');
            }
        } else {
            // User not found
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);

        // Rollback the transaction if an error occurs
        await pool.rollback();

        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
