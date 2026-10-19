const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const rootRouter = require('./routes/index');

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
    // If no origin (e.g. server-to-server or curl) or in allowed list, permit
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

// Connect to MongoDB
connectDB();

// Mount single centralized root API router
app.use('/api', rootRouter);

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
    message = `An account with this ${field} already exists.`;
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
