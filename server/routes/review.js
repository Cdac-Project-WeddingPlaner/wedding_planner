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

// Create a review
router.post('/', (req, res) => {
    const { plan_id, client_id, review } = req.body;

    const sql = 'INSERT INTO reviews (plan_id, client_id, review) VALUES (?, ?, ?)';

    pool.query(sql, [plan_id, client_id, review], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(201).send('Review created successfully');
    });
});

// Get all reviews
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM reviews';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

// Get review by review_id
router.get('/:review_id', (req, res) => {
    const reviewId = req.params.review_id;
    const sql = 'SELECT * FROM reviews WHERE review_id = ?';

    pool.query(sql, [reviewId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 1) {
            res.json(results[0]);
        } else {
            res.status(404).send('Review not found');
        }
    });
});

// Get reviews by plan_id
router.get('/plan/:plan_id', (req, res) => {
    const planId = req.params.plan_id;
    const sql = 'SELECT * FROM reviews WHERE plan_id = ?';

    pool.query(sql, [planId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

// Get reviews by client_id
router.get('/client/:client_id', (req, res) => {
    const clientId = req.params.client_id;
    const sql = 'SELECT * FROM reviews WHERE client_id = ?';

    pool.query(sql, [clientId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

// Get reviews by vendor_id
router.get('/vendor/:vendor_id', (req, res) => {
    const vendorId = req.params.vendor_id;
    const sql = `
        SELECT reviews.*
        FROM reviews
        JOIN plans ON reviews.plan_id = plans.plan_id
        JOIN vendors ON plans.vendor_id = vendors.vendor_id
        WHERE vendors.vendor_id = ?
    `;

    pool.query(sql, [vendorId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

// Update a review
router.put('/:review_id', (req, res) => {
    const reviewId = req.params.review_id;
    const { review } = req.body;

    const sql = 'UPDATE reviews SET review = ? WHERE review_id = ?';

    pool.query(sql, [review, reviewId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Review not found');
        } else {
            res.status(200).send('Review updated successfully');
        }
    });
});

// Delete a review
router.delete('/:review_id', (req, res) => {
    const reviewId = req.params.review_id;
    const sql = 'DELETE FROM reviews WHERE review_id = ?';

    pool.query(sql, [reviewId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Review not found');
        } else {
            res.status(200).send('Review deleted successfully');
        }
    });
});

module.exports = router;
