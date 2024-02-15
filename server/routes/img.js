const express = require('express');
const router = express.Router();
const path = require('path');


// Get image by file name
router.get('/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    // Assuming the images are stored in the 'uploads' directory
    const imagePath = path.join(__dirname, `uploads/${fileName}`);

    // Send the image file
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send({ error :'Image not found'});
        }
    });
});

router.get('/logos/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    // Assuming the images are stored in the 'uploads' directory
    const imagePath = path.join(__dirname, `uploads/logos/${fileName}`);

    // Send the image file
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send({ error :'Image not found'});
        }
    });
});

router.get('/avatars/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    // Assuming the images are stored in the 'uploads' directory
    const imagePath = path.join(__dirname, `uploads/avatars/${fileName}`);

    // Send the image file
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send({ error :'Image not found'});
        }
    });
});

router.get('/plans/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    // Assuming the images are stored in the 'uploads' directory
    const imagePath = path.join(__dirname, `uploads/plans/${fileName}`);

    // Send the image file
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send({ error :'Image not found'});
        }
    });
});

router.get('/by-plan/:plan_id', async (req, res) => {
    try {
      const planId = req.params.plan_id;
  
      const getImagesSql = 'SELECT * FROM vendor_images WHERE plan_id = ?';
  
      const [images, _] = await pool.query(getImagesSql, [planId]);
  
      res.status(200).json({ images });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;
