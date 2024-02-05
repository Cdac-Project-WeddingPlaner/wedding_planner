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

// Get All Wedding Plan Selections using the weddingselection view
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM weddingselection';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Get Wedding Plan Selection by ID using the weddingselection view
router.get('/:selection_id', (req, res) => {
    const selectionId = req.params.selection_id;

    const sql = 'SELECT * FROM weddingselection WHERE selection_id = ?';

    pool.query(sql, [selectionId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).send('Wedding Plan Selection not found');
        }
    });
});

// Create Wedding Plan Selection
router.post('/', (req, res) => {
    const { wd_id } = req.body;

    pool.query(
        'INSERT INTO weddingPlanSelections (wd_id) VALUES (?)',
        [wd_id],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            const selectionId = results.insertId;
            res.status(201).json({ selection_id: selectionId, message: 'Wedding Plan Selection created successfully' });
        }
    );
});

// Update Wedding Plan Selection date and time
router.put('/update', (req, res) => {
    const { selection_id, plan_id, date, time } = req.body;

    pool.query(
        'UPDATE weddingPlanSelections_Plans SET date = ?, time = ? WHERE selection_id = ? AND plan_id = ?',
        [date, time, selection_id, plan_id],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 1) {
                res.status(200).send('Wedding Plan Selection date and time updated successfully');
            } else {
                res.status(404).send('Wedding Plan Selection or Plan not found');
            }
        }
    );
});



// Add Plan to Wedding Plan Selection with status pending, date, and time
router.post('/plans', (req, res) => {
    const { selection_id, plan_id, date, time } = req.body;

    pool.query(
        'INSERT INTO weddingPlanSelections_Plans (selection_id, plan_id, date, time, status) VALUES (?, ?, ?, ?, "pending")',
        [selection_id, plan_id, date, time],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(201).json({ message: 'Plan added to Wedding Plan Selection successfully' });
        }
    );
});



// Delete Wedding Plan Selection by ID with all associated plans
router.delete('/:selection_id', (req, res) => {
    const selectionId = req.params.selection_id;

    const deletePlansSql = 'DELETE FROM weddingPlanSelections_Plans WHERE selection_id = ?';
    const deleteSelectionSql = 'DELETE FROM weddingPlanSelections WHERE selection_id = ?';

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

            // Delete associated plans
            connection.query(deletePlansSql, [selectionId], (err, planResults) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    });
                }

                // Delete Wedding Plan Selection
                connection.query(deleteSelectionSql, [selectionId], (err, selectionResults) => {
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
                        res.status(200).send('Wedding Plan Selection deleted successfully');
                    });
                });
            });
        });
    });
});

// Get Wedding Plan Selections by Vendor ID using the weddingselection view
router.get('/vendor/:vendor_id', (req, res) => {
    const vendorId = req.params.vendor_id;

    const sql = 'SELECT * FROM weddingselection WHERE vendor_id = ?';

    pool.query(sql, [vendorId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Get Wedding Plan Selections by Client ID using the weddingselection view
router.get('/client/:client_id', (req, res) => {
    const clientId = req.params.client_id;

    const sql = `
        SELECT 
            plan_id,
            title,
            price,
            date,
            time,
            status
        FROM weddingselection
        WHERE client_id = ?`;

    pool.query(sql, [clientId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});

// Delete Plan Selection from Wedding Plan Selections
router.delete('/p/plans', (req, res) => {
    const { selection_id, plan_id } = req.body;

    console.log('Request Body:', req.body);
    pool.query(
        'DELETE FROM weddingPlanSelections_Plans WHERE selection_id = ? AND plan_id = ?',
        [selection_id, plan_id],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 1) {
                res.status(200).send('Plan Selection deleted successfully');
            } else {
                res.status(404).send('Plan Selection not found');
            }
        }
    );
});



module.exports = router;
