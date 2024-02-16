const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
const config = require('config');

const pool = mysql.createPool({
  host: config.get('SERVER'),
  user: config.get('USER'),
  password: config.get('PASSWORD'),
  database: config.get('DATABASE'),
});

// Get image by file name
router.get('/:fileName', (req, res) => {
  const fileName = req.params.fileName;

  const imagePath = path.join(__dirname, `uploads/${fileName}`);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send({ error: 'Image not found' });
    }
  });
});

router.get('/logos/:fileName', (req, res) => {
  const fileName = req.params.fileName;

  const imagePath = path.join(__dirname, `uploads/logos/${fileName}`);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send({ error: 'Image not found' });
    }
  });
});

router.get('/avatars/:fileName', (req, res) => {
  const fileName = req.params.fileName;

  const imagePath = path.join(__dirname, `uploads/avatars/${fileName}`);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send({ error: 'Image not found' });
    }
  });
});

router.get('/plans/:fileName', (req, res) => {
  const fileName = req.params.fileName;

  const imagePath = path.join(__dirname, `uploads/plans/${fileName}`);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send({ error: 'Image not found' });
    }
  });
});

router.get('/by-plan/:plan_id', (req, res) => {
  try {
    const planId = req.params.plan_id;

    const getImagesSql = 'SELECT * FROM vendor_images WHERE plan_id = ?';

    pool.query(getImagesSql, [planId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json({ images: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/avatars/by-client/:clientId', (req, res) => {
  try {
    const clientId = req.params.clientId;

    const getClientAvatarUrlSql = 'SELECT avatar_image_url FROM clients WHERE client_id = ?';

    pool.query(getClientAvatarUrlSql, [clientId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0 || !results[0].avatar_image_url) {
        return res.status(404).send({ error: 'Avatar not found' });
      }

      const avatarPath = path.join(__dirname, `uploads/avatars/${results[0].avatar_image_url}`);

      res.sendFile(avatarPath, (err) => {
        if (err) {
          console.error(err);
          res.status(404).send({ error: 'Avatar not found' });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
