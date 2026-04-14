const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflows', require('./routes/workflows'));
app.use('/api/runs', require('./routes/runs'));
app.use('/health', require('./routes/health'));
app.use('/api/diagnostic', require('./routes/diagnostic'));

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Make sure your MongoDB server is running and the MONGODB_URI is correct.');
  });


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});