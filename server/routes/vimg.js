const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const config = require('config');
const { authenticateUser } = require('./authenticate');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/plans/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// MySQL database configuration
const pool = mysql.createPool({
  host: config.get('SERVER'),
  user: config.get('USER'),
  password: config.get('PASSWORD'),
  database: config.get('DATABASE'),
});

router.post('/upload', authenticateUser, (req, res) => {
  try {
    // Check if the user has vendor or admin access
    if (req.user_type !== 'vendor') {
      return res.status(403).json({ error: 'Forbidden. Vendor access required.' });
    }

    const vendorId = req.body.vendor_id; // Assuming vendor_id is passed in the request body
    const planId = req.body.plan_id; // Assuming plan_id is passed in the request body
    const description = req.body.description; // Assuming description is passed in the request body
    const image = req.file;

    // Check if vendor_id and plan_id exist and other necessary validation

    const insertImageSql = `
      INSERT INTO vendor_images (vendor_id, plan_id, image_url, description, uploaded_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    const imageUrl = image.path;
    const uploadedAt = new Date();

    pool.query(insertImageSql, [vendorId, planId, imageUrl, description, uploadedAt], (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(200).json({ message: 'Image uploaded and data inserted successfully', imageUrl });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
