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

router.get('/', authenticateUser, (req, res) => {
    // Check if the user has admin privileges
    if (req.user_type !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }

    const sql = 'SELECT * FROM VendorView';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Get vendor profile route using the VendorView
router.get('/:vendor_id', authenticateUser, (req, res) => {
    // Check if the authenticated user is a vendor or admin
    if (req.user_type !== 'vendor' && req.user_type !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Vendor or admin access required.' });
    }

    const vendorId = req.params.vendor_id;

    // SQL query to retrieve vendor profile information using the VendorView
    const sql = `
        SELECT *
        FROM VendorView
        WHERE vendor_id = ?
    `;

    pool.query(sql, [vendorId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 1) {
            const vendorProfile = results[0];
            res.status(200).json(vendorProfile);
        } else {
            res.status(404).send('Vendor not found');
        }
    });
});



// Update vendor information route
router.put('/:vendor_id', authenticateUser, (req, res) => {
    // Check if the authenticated user is a vendor
    if (req.user_type !== 'vendor') {
        return res.status(403).json({ error: 'Forbidden. Vendor access required.' });
    }
    const vendorId = req.params.vendor_id;

    if (req.user_id !== vendorId) {
        return res.status(403).json({ error: 'Forbidden. Vendor access required.' });
    }

    
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

    // Update user information
    pool.query(
        'UPDATE users SET email=?, password=?, first_name=?, middle_name=?, last_name=?, phone_number=?, address=? WHERE user_id = (SELECT user_id FROM vendors WHERE vendor_id = ?)',
        [email, password, first_name, middle_name, last_name, phone_number, address, vendorId],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Update vendor information
            pool.query(
                'UPDATE vendors SET service_type=?, business_name=?, contact_email=?, altarnet_number=?, business_address=?, logo_image_url=?, description=?, is_verified=? WHERE vendor_id = ?',
                [service_type, business_name, contact_email, altarnet_number, business_address, logo_image_url, description, is_verified, vendorId],
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    res.status(200).send('Vendor information updated successfully');
                }
            );
        }
    );
});



module.exports = router;
