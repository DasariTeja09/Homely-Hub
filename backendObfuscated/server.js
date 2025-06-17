const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables (for local development)
dotenv.config({ path: './config.env' });

// Use Railway's MONGO_URL or fallback to local DATABASE_LOCAL
const DB = process.env.MONGO_URL || process.env.DATABASE_LOCAL;

console.log('Using DB:', DB);

// Connect to MongoDB with proper options
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connection successful'))
.catch(err => {
  console.error('DB connection error:', err);
  process.exit(1); // Exit process on connection failure
});

const port = process.env.PORT || 8000; // Use Railway's PORT if available
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
