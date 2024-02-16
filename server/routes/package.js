const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('config');

const { authenticateUser } = require('./authenticate');

const pool = mysql.createPool({
    host: config.get('SERVER'),
    user: config.get('USER'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE')
});

// Add Package
router.post('/', authenticateUser, (req, res) => {
  // Check if the authenticated user is an admin
  if (req.user_type !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }

  const { packagename } = req.body;

  pool.query('INSERT INTO package (packagename) VALUES (?)', [packagename], (err, result) => {
      if (err) {
          console.error('Error adding package:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.status(201).json({ packageId: result.insertId, packagename });
  });
});



// Delete Package (including associated plans)
router.delete('/:packageId', authenticateUser, (req, res) => {
  // Check if the authenticated user is an admin
  if (req.user_type !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }

  const { packageId } = req.params;

  pool.query('DELETE FROM package WHERE package_id = ?', [packageId], err => {
      if (err) {
          console.error('Error deleting package:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.status(200).json({ message: 'Package deleted' });
  });
});



// Get All Packages with Plans
router.get('/', (req, res) => {
    pool.query('SELECT * FROM package', (err, packageResults) => {
      if (err) {
        console.error('Error getting all packages:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // Fetch plans for each package
      const packagesWithPlans = [];
      const fetchPlansForPackage = (index) => {
        if (index === packageResults.length) {
          // All packages processed, send the response
          res.status(200).json(packagesWithPlans);
          return;
        }
  
        const packageData = packageResults[index];
        pool.query(
          'SELECT plans.* FROM plans JOIN plan_package ON plans.plan_id = plan_package.plan_id WHERE plan_package.package_id = ?',
          [packageData.package_id],
          (err, planResults) => {
            if (err) {
              console.error('Error getting plans for package:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }
  
            packageData.plans = planResults;
            packagesWithPlans.push(packageData);
  
            // Process the next package
            fetchPlansForPackage(index + 1);
          }
        );
      };
  
      // Start processing packages
      fetchPlansForPackage(0);
    });
  });
  



// Get Package with all Plans
router.get('/:packageId', (req, res) => {
  const { packageId } = req.params;

  pool.query('SELECT * FROM package WHERE package_id = ?', [packageId], (err, results) => {
    if (err) {
      console.error('Error getting package:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }

    const packageData = results[0];

    pool.query(
      'SELECT plans.* FROM plans JOIN plan_package ON plans.plan_id = plan_package.plan_id WHERE plan_package.package_id = ?',
      [packageId],
      (err, planResults) => {
        if (err) {
          console.error('Error getting plans for package:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        packageData.plans = planResults;
        res.status(200).json(packageData);
      }
    );
  });
});


// Update Plans in Package
router.put('/:packageId', authenticateUser, (req, res) => {
  // Check if the authenticated user is an admin
  if (req.user_type !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }

  const { packageId } = req.params;
  const newPlans = req.body.newPlans;

  if (!Array.isArray(newPlans) || newPlans.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty newPlans array in the request body' });
  }

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting connection from pool:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      connection.beginTransaction((err) => {
          if (err) {
              connection.release();
              console.error('Error starting transaction:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          // Delete existing plans
          connection.query('DELETE FROM plan_package WHERE package_id = ?', [packageId], (err) => {
              if (err) {
                  return connection.rollback(() => {
                      connection.release();
                      console.error('Error deleting plans from package:', err);
                      res.status(500).json({ error: 'Internal Server Error' });
                  });
              }

              // Add new plans
              const values = newPlans.map(plan => [plan.planId, packageId]);

              connection.query('INSERT INTO plan_package (plan_id, package_id) VALUES ?', [values], (err) => {
                  if (err) {
                      return connection.rollback(() => {
                          connection.release();
                          console.error('Error adding new plans to package:', err);
                          res.status(500).json({ error: 'Internal Server Error' });
                      });
                  }

                  connection.commit((err) => {
                      if (err) {
                          return connection.rollback(() => {
                              connection.release();
                              console.error('Error committing transaction:', err);
                              res.status(500).json({ error: 'Internal Server Error' });
                          });
                      }

                      connection.release();
                      res.status(200).json({ message: 'Plans updated in package' });
                  });
              });
          });
      });
  });
});


module.exports = router;
