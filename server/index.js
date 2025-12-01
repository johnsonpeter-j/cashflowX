const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure allowed origins
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : [
      'http://localhost:3000',
      'http://localhost:19006', // Expo default
      'http://localhost:8081',  // React Native Metro
      'http://127.0.0.1:3000',
      'http://127.0.0.1:19006',
    ];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const subCategoryRoutes = require('./routes/subCategory');
const budgetRoutes = require('./routes/budget');
const transactionRoutes = require('./routes/transaction');

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'CashFlowX API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes (require authentication)
app.use('/api/user', userRoutes);

// Category routes (require authentication)
app.use('/api/category', categoryRoutes);

// Sub-category routes (require authentication)
app.use('/api/sub-category', subCategoryRoutes);

// Budget routes (require authentication)
app.use('/api/budget', budgetRoutes);

// Transaction routes (require authentication)
app.use('/api/transaction', transactionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
