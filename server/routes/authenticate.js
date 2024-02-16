const mysql = require('mysql2');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Middleware to check if a user is authenticated
const authenticateUser = async (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.header('x-auth-token');

    // Check if the token is missing
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Token missing.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Add the user information to the request object
        req.user_id = decoded.user_id;
        req.user_type = decoded.user_type
      
        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }
};

module.exports = { authenticateUser };