const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');

// --- 1. Customer Storefront Module Routers ---
const authRoutes = require('./features/auth/routes/authRoutes');
const categoryRoutes = require('./features/category/routes/categoryRoutes');
const productRoutes = require('./features/product/routes/productRoutes');
const cutRoutes = require('./features/product/routes/cutRoutes');
const { router: pantryRouter, publicRouter: pantryPublicRoutes } = require('./features/grocery/routes/groceryRoutes');

// --- 2. Admin Management Feature Routers (features/admin/) ---
const adminAuthRoutes = require('./features/admin/auth/routes/adminAuthroutes');
const adminCategoryRoutes = require('./features/admin/category/routes/adminCategoryroutes');
const adminProductRoutes = require('./features/admin/product/routes/adminProductroutes');
const adminCutRoutes = require('./features/admin/product/routes/adminCutroutes');
const adminDashboardRoutes = require('./features/admin/dashboard/routes/adminDashboardroutes');
const adminUserRoutes = require('./features/admin/user/routes/adminUserroutes');

const app = express();

// Allowed Origins for Web Browsers & Local Dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

// Configure CORS BEFORE any routes (Express 5 compatible)
const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Dev fallback to prevent network blocks
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

// Global CORS Middleware handles all preflight OPTIONS automatically
app.use(cors(corsOptions));

// Global Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[HTTP Request ${timestamp}] ${req.method} ${req.originalUrl || req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (Category & Product images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
connectDB();

// Health & Info Endpoint: GET /api
app.get('/api', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'Urban Cleaver API',
    version: '2.0.0 (Modular Domain Architecture)',
    adminEndpoints: {
      auth: '/api/admin/auth',
      categories: '/api/admin/categories',
      products: '/api/admin/products',
      cuts: '/api/admin/cuts',
      dashboard: '/api/admin/dashboard',
      users: '/api/admin/users',
    },
    storefrontEndpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cuts: '/api/cuts',
      pantry: '/api/pantry',
    },
  });
});

// --- MOUNT ADMIN MANAGEMENT ROUTES (features/admin/) ---
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/cuts', adminCutRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUserRoutes);

// --- MOUNT STOREFRONT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cuts', cutRoutes);
app.use('/api/pantry', pantryRouter);

// --- STOREFRONT PUBLIC COMPATIBILITY ALIASES ---
app.use('/api/public/categories', categoryRoutes);
app.use('/api/public/products', productRoutes);
app.use('/api/public/cuts', cutRoutes);
app.use('/api/public/pantry', pantryPublicRoutes);

// Root Ping
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Urban Cleaver Server is running. Access API endpoints at /api',
  });
});

// 404 Route Catch-all (Express 5 compatible wildcard)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account or record with this ${field} already exists.`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please login again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

const PORT = process.env.PORT || 5000;
let serverInstance = null;

const startServer = (port = PORT) => {
  if (!serverInstance) {
    serverInstance = app.listen(port, () => {
      console.log(`[Urban Cleaver] Server running on port ${port} (HTTP: http://localhost:${port})`);
    });
  }
  return serverInstance;
};

// Auto-start if run directly
if (require.main === module) {
  startServer(PORT);
}

module.exports = { app, startServer, server: serverInstance };
