const mongoose = require('mongoose');
const app = require('./app');

// 1. Debugging - will show in Railway logs
console.log("Railway Environment Variables:", Object.keys(process.env));
console.log("MONGO_URL present:", !!process.env.MONGO_URL);

// 2. Mandatory check - exit if missing
if (!process.env.MONGO_URL) {
  console.error("❌❌❌ EMERGENCY: MONGO_URL IS UNDEFINED ❌❌❌");
  console.error("Check Railway Variables -> Service Variables -> MONGO_URL exists");
  process.exit(1);
}

// 3. Connect with timeout
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // 5 second timeout
})
.then(() => console.log("✅✅✅ MongoDB Connected Successfully"))
.catch(err => {
  console.error("❌❌❌ MongoDB Connection Failed:", err.message);
  process.exit(1);
});

// 4. Use Railway's PORT (never hardcode)
const port = process.env.PORT || 3000; // Must be number (no 0809)
app.listen(port, () => {
  console.log(`🚀🚀🚀 Server running on PORT ${port} (Not 0809)`);
});
