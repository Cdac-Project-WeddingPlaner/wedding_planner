// routes/clients.js
// This file contains the routes for handling clients

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('config');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
  host: config.get('SERVER'),
  user: config.get('USER'),
  password: config.get('PASSWORD'),
  database: config.get('DATABASE'),
});

router.get('/', authenticateUser, (req, res) => {
  // Check if the user has admin privileges
  if (req.user_type !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }

  const sql = 'SELECT * FROM ClientView';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
  });
});

router.get('/:user_id', authenticateUser, (req, res) => {
  const UserId = req.params.user_id;

  // Check if the user is either an admin or the requested client
  if (req.user_type !== 'admin' && req.user_type !== 'client' && req.user_id !== UserId) {
    return res.status(403).json({ error: 'Forbidden. Insufficient privileges.' });
  }

  const sql = 'SELECT * FROM ClientView WHERE user_id = ?';

  pool.query(sql, [UserId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 1) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
});

router.put('/:client_id', authenticateUser, (req, res) => {
  const clientId = req.params.client_id;
  const { email, phone_number, first_name, last_name, address } = req.body;

  const updateUserSql = `
    UPDATE users
    SET email=?, phone_number=?, first_name=?, last_name=?, address=?
    WHERE user_id = (SELECT user_id FROM clients WHERE client_id = ?);
  `;

  const updateClientSql = 'UPDATE clients SET user_id = user_id WHERE client_id = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      connection.query(updateUserSql, [email, phone_number, first_name, last_name, address, clientId], (err, userResults) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
        }

        connection.query(updateClientSql, [clientId], (err, clientResults) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
              });
            }

            connection.release();
            res.status(200).json({ message: 'Client updated successfully' });
          });
        });
      });
    });
  });
});

module.exports = router;
