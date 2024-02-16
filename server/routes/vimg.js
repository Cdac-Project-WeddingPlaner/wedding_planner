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
    cb(null, path.join(__dirname, `uploads/plans`));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname !== 'file') {
      return cb(new Error('Invalid field name'), false);
    }
    cb(null, true);
  }
}).single('file');

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

    // Assuming vendor_id, plan_id, and description are passed in the request body
    console.log('Request body:', req.body);
    const { vendor_id, plan_id, description } = req.body;
    console.log('vpd body:', vendor_id, plan_id, description );

    upload(req, res, function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error uploading file' });
      }

      const image = req.file;
      const imageUrl = image.filename; // Change this to get the filename instead of the full path

      const insertImageSql = `
        INSERT INTO vendor_images (vendor_id, plan_id, image_url, description, uploaded_at)
        VALUES (?, ?, ?, ?, NOW())`; // Use MySQL NOW() function to get the current timestamp

      pool.query(insertImageSql, [vendor_id, plan_id, imageUrl, description], (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Image uploaded and data inserted successfully', imageUrl });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
