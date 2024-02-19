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
router.post('/', authenticateUser, (req, res) => {
    // Check if the authenticated user is a vendor
    if (req.user_type !== 'vendor') {
        return res.status(403).json({ error: 'Forbidden. Vendor access required.' });
    }

    const { vendor_id, title, description, price } = req.body;

    pool.query(
        'INSERT INTO plans (vendor_id, title, description, price, is_verified) VALUES (?, ?, ?, ?, ?)',
        [vendor_id, title, description, price, 'pending'],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error :  'Internal Server Error'});
                return;
            }

            const planId = results.insertId;
            res.status(201).json({ plan_id: planId, message: 'Plan created successfully' });
        }
    );
});


// Get all plans
router.get('/', (req, res) => {
    const sql = `
        SELECT plans.*, AVG(reviews.rating) AS rating, count(reviews.rating) AS count
        FROM plans
        LEFT JOIN reviews ON plans.plan_id = reviews.plan_id
        GROUP BY plans.plan_id;
    `;

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error :  'Internal Server Error'});
            return;
        }

        const plansWithAvgRating = results.map((plan) => {
            const { rating, ...rest } = plan;
            return { ...rest, rating: rating || 0 }; // Default to 0 if no reviews
        });

        res.status(200).json(plansWithAvgRating);
    });
});

// Get a specific plan by ID
router.get('/:plan_id', (req, res) => {
    const planId = req.params.plan_id;

    const sql = `
        SELECT plans.*, AVG(reviews.rating) AS rating, count(reviews.rating) AS count
        FROM plans
        LEFT JOIN reviews ON plans.plan_id = reviews.plan_id
        WHERE plans.plan_id = 1
        GROUP BY plans.plan_id;
    `;

    pool.query(sql, [planId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error :  'Internal Server Error'});
            return;
        }

        if (results.length === 1) {
            const { average_rating, ...rest } = results[0];
            res.status(200).json({ ...rest, average_rating: average_rating || 0 });
        } else {
            res.status(404).send({error : 'Plan not found'});
        }
    });
});

// Update a plan by ID
router.put('/:plan_id', authenticateUser, (req, res) => {
    // Check if the authenticated user is a vendor
    if (req.user_type !== 'vendor') {
        return res.status(403).json({ error: 'Forbidden. Vendor access required.' });
    }

    const planId = req.params.plan_id;
    const { title, description, price, is_verified } = req.body;

    pool.query(
        'UPDATE plans SET title=?, description=?, price=?, is_verified=? WHERE plan_id = ?',
        [title, description, price, is_verified, planId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error :  'Internal Server Error'});
                return;
            }

            if (results.affectedRows === 1) {
                res.status(200).send({message : 'Plan updated successfully'});
            } else {
                res.status(404).send({error : 'Plan not found'});
            }
        }
    );
});


// Delete a plan by ID
router.delete('/:plan_id', authenticateUser, (req, res) => {
    // Check if the authenticated user is a vendor
    if (req.user_type !== 'vendor') {
        return res.status(403).json({ error: 'Forbidden. Vendor access required.' });
    }

    const planId = req.params.plan_id;

    pool.query('DELETE FROM plans WHERE plan_id = ?', [planId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error :  'Internal Server Error'});
            return;
        }

        if (results.affectedRows === 1) {
            res.status(200).send({message : 'Plan deleted successfully'});
        } else {
            res.status(404).send({error : 'Plan not found'});
        }
    });
});


// Get verified plans
router.get('/v/v', (req, res) => {
    const sql = `
        SELECT plans.*, AVG(reviews.rating) AS rating, count(reviews.rating) AS count
        FROM plans
        LEFT JOIN reviews ON plans.plan_id = reviews.plan_id
        WHERE plans.is_verified = 1
        GROUP BY plans.plan_id;
    `;

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error :  'Internal Server Error'});
            return;
        }

        const verifiedPlansWithAvgRating = results.map((plan) => {
            const { average_rating, ...rest } = plan;
            return { ...rest, average_rating: average_rating || 0 }; // Default to 0 if no reviews
        });

        res.status(200).json(verifiedPlansWithAvgRating);
    });
});

// Get plans by vendor id
router.get('/vendor/:vendor_id', (req, res) => {
    const vendorId = req.params.vendor_id;

    const sql = `
        SELECT plans.*, AVG(reviews.rating) AS rating, count(reviews.rating) AS count
        FROM plans
        LEFT JOIN reviews ON plans.plan_id = reviews.plan_id
        WHERE plans.vendor_id = ?
        GROUP BY plans.plan_id;
    `;

    pool.query(sql, [vendorId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error :  'Internal Server Error'});
            return;
        }

        const plansByVendorWithAvgRating = results.map((plan) => {
            const { average_rating, ...rest } = plan;
            return { ...rest, average_rating: average_rating || 0 }; // Default to 0 if no reviews
        });

        res.status(200).json(plansByVendorWithAvgRating);
    });
});

// Change Plan Status by ID
router.patch('/:plan_id', authenticateUser, (req, res) => {
    // Check if the authenticated user is an admin
    if (req.user_type !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }

    const planId = req.params.plan_id;
    const { is_verified } = req.body;

    pool.query(
        'UPDATE plans SET is_verified=? WHERE plan_id = ?',
        [is_verified, planId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error : 'Internal Server Error'});
                return;
            }

            if (results.affectedRows === 1) {
                res.status(200).send({message : 'Plan status updated successfully'});
            } else {
                res.status(404).send({error : 'Plan not found'});
            }
        }
    );
});


// Get Plans by Vendor Service Type
router.get('/service/:serviceType', (req, res) => {
    const serviceType = req.params.serviceType;

    const sql = `
        SELECT plans.*, AVG(reviews.rating) AS rating, count(reviews.rating) AS count
        FROM plans
        LEFT JOIN reviews ON plans.plan_id = reviews.plan_id
        JOIN vendors ON plans.vendor_id = vendors.vendor_id
        WHERE vendors.service_type = ? AND plans.is_verified = 1
        GROUP BY plans.plan_id;
    `;

    pool.query(sql, [serviceType], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error : 'Internal Server Error'});
            return;
        }

        const verifiedPlansByServiceTypeWithAvgRating = results.map((plan) => {
            const { average_rating, ...rest } = plan;
            return { ...rest, average_rating: average_rating || 0 }; // Default to 0 if no reviews
        });

        res.status(200).json(verifiedPlansByServiceTypeWithAvgRating);
    });
});



module.exports = router;
