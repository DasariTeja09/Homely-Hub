const mongoose = require('mongoose');
const app = require('./app');

// 1. Add DNS configuration to prevent SRV lookup issues
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// 2. Add connection debugging
console.log("MONGO_URL present:", !!process.env.MONGO_URL);
console.log("PORT:", process.env.PORT);

// 3. MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000,  // Increased timeout
  maxPoolSize: 10,
  socketTimeoutMS: 45000
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => {
  console.error("❌ MongoDB Connection Failed:", err.message);
  console.error("Full error:", err);
  process.exit(1);
});

// 4. Add root route handler BEFORE starting server
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date()
  });
});

// 5. Add health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    db: dbStatus,
    uptime: process.uptime()
  });
});

// 6. Add error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// 7. Get port from environment variable
const port = process.env.PORT || 8888;

// 8. Start server with explicit host binding
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Access URL: http://localhost:${port}`);
});

// 9. Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// 10. Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  server.close(() => process.exit(1));
});
