const express = require('express');
const cookieParser = require('cookie-parser');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/rent/listing', propertyRoutes);
app.use('/api/v1/rent/user', userRoutes);

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error('❌ Express Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
