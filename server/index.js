const express = require('express');
const config = require('config');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendorRoutes');
const planRoutes = require('./routes/planRoutes');
const reviewRoutes = require('./routes/review');
const packageRoutes = require('./routes/package');
const weddingRoutes = require('./routes/wedding');
const clientRoutes = require('./routes/client');
const weddingSelectionRoutes = require('./routes/weddingSelection');

const app = express();
app.use(cors())
const port = config.get('PORT') || 3000;

app.use(express.json()); // Use the built-in JSON parser

// Use the authentication routes
app.use('/auth', authRoutes);
app.use('/vendor', vendorRoutes);
app.use('/plans', planRoutes);
app.use('/review', reviewRoutes);
app.use('/packages', packageRoutes);
app.use('/wedding', weddingRoutes);
app.use('/client', clientRoutes);
app.use('/wedsel', weddingSelectionRoutes);

// Additional routes and middleware can be added here

app.listen(port, config.get('SERVER'), () => {
    console.log(`Server is running at http://${config.get('SERVER')}:${port}`);
});
