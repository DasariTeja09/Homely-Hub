const dns = require('dns');
const mongoose = require('mongoose');
const app = require('./app');

// 1. DNS configuration to prevent SRV lookup issues
dns.setDefaultResultOrder('ipv4first');

// 2. Critical debugging logs
console.log('===== ENVIRONMENT VARIABLES =====');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL present:', !!process.env.MONGO_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('===============================');

// 3. MongoDB connection with enhanced error handling
if (!process.env.MONGO_URL) {
  console.error('❌ FATAL ERROR: MONGO_URL is not defined');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`Database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Failed:', err.message);
  console.error('Error details:', err);
  process.exit(1);
});

// 4. Get port from environment variable
const port = process.env.PORT || 8888;

// 5. Start server with explicit host binding
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Access URL: http://localhost:${port}`);
  console.log(`🩺 Health check: http://localhost:${port}/health`);
});

// 6. Handle process terminations
process.on('SIGINT', () => {
  console.log('\n🔻 Shutting down server (SIGINT)');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('🔻 MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  console.log('\n🔻 Shutting down server (SIGTERM)');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('🔻 MongoDB connection closed');
      process.exit(0);
    });
  });
});

// 7. Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});

// 8. Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.stack);
  server.close(() => process.exit(1));
});
