const mongoose = require('mongoose');
const app = require('./app');

// Remove deprecated options and add current best practices
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10, // Recommended for most applications
  socketTimeoutMS: 45000 // Close sockets after 45s of inactivity
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => {
  console.error("❌ MongoDB Connection Failed:", err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
app.get('/', (req, res) => {
  res.send('Homepage Loaded!');
});
