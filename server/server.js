const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Route imports
const usersRoutes = require('./routes/users');
const skillsRoutes = require('./routes/skills');
const swapsRoutes = require('./routes/swaps');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', usersRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/swaps', swapsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('SkillBridge API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
