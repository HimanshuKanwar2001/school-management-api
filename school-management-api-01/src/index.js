const express = require('express');
const app = express();
const schoolRoutes = require('./routes/schoolRoutes');
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.use('/api', schoolRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});