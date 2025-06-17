const mongoose = require('mongoose');
const app = require('./app');

// Get MongoDB connection string directly from environment
const DB = process.env.MONGO_URL;

// CRITICAL DEBUGGING - DO NOT REMOVE
console.log('Environment Variables:', Object.keys(process.env));
console.log('MONGO_URL present:', !!DB);
console.log('Connection String:', DB ? `${DB.substring(0, 25)}...` : 'UNDEFINED');

if (!DB) {
  console.error('FATAL ERROR: MONGO_URL is undefined');
  console.error('Possible causes:');
  console.error('1. MongoDB service not attached to application');
  console.error('2. Variable name mismatch (should be MONGO_URL)');
  console.error('3. Deployment not restarted after variable change');
  process.exit(1);
}

// Connect with modern settings and timeout
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000  // Fail after 5 seconds
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('Full error:', err);
  process.exit(1);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
