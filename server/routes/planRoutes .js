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

// Create a new plan
router.post('/', (req, res) => {
    const { vendor_id, title, description, price } = req.body;

    pool.query(
        'INSERT INTO plans (vendor_id, title, description, price, is_verified) VALUES (?, ?, ?, ?, ?)',
        [vendor_id, title, description, price, "pending"],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            const planId = results.insertId;
            res.status(201).json({ plan_id: planId, message: 'Plan created successfully' });
        }
    );
});

// Get all plans
router.get('/', (req, res) => {
    pool.query('SELECT * FROM plans', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Get a specific plan by ID
router.get('/:plan_id', (req, res) => {
    const planId = req.params.plan_id;

    pool.query('SELECT * FROM plans WHERE plan_id = ?', [planId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 1) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Plan not found');
        }
    });
});

// Update a plan by ID
router.put('/:plan_id', (req, res) => {
    const planId = req.params.plan_id;
    const { title, description, price, is_verified } = req.body;

    pool.query(
        'UPDATE plans SET title=?, description=?, price=?, is_verified=? WHERE plan_id = ?',
        [title, description, price, is_verified, planId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 1) {
                res.status(200).send('Plan updated successfully');
            } else {
                res.status(404).send('Plan not found');
            }
        }
    );
});

// Delete a plan by ID
router.delete('/:plan_id', (req, res) => {
    const planId = req.params.plan_id;

    pool.query('DELETE FROM plans WHERE plan_id = ?', [planId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.affectedRows === 1) {
            res.status(200).send('Plan deleted successfully');
        } else {
            res.status(404).send('Plan not found');
        }
    });
});

// Get verified plans
router.get('/v/v', (req, res) => {
    const sql = 'SELECT * FROM plans WHERE is_verified = 1';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log("Result:", results); // Add this line for debugging

        res.status(200).json(results);
    });
});

router.get('/vendor/:vendor_id', (req, res) => {
    const vendorId = req.params.vendor_id;

    pool.query('SELECT * FROM plans WHERE vendor_id = ?', [vendorId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Change Plan Status by ID
router.patch('/:plan_id', (req, res) => {
    const planId = req.params.plan_id;
    const { is_verified } = req.body;

    pool.query(
        'UPDATE plans SET is_verified=? WHERE plan_id = ?',
        [is_verified, planId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 1) {
                res.status(200).send('Plan status updated successfully');
            } else {
                res.status(404).send('Plan not found');
            }
        }
    );
});

// Get Plans by Vendor Service Type
router.get('/service/:serviceType', (req, res) => {
    const serviceType = req.params.serviceType;
    const sql = `
        SELECT plans.*
        FROM plans
        JOIN vendors ON plans.vendor_id = vendors.vendor_id
        WHERE vendors.service_type = ?;
    `;

    pool.query(sql, [serviceType], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});



module.exports = router;
