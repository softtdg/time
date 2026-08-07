const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

const envPath = path.join(__dirname, `src/config/.env_${process.env.NODE_ENV || 'local'}`);
require('dotenv').config({ path: envPath, debug: false });

// 🔹 MSSQL pool manager
const {
  initializeAllConnections,
  closeAllConnections,
} = require('./src/db/mssqlPool');

// mongo connection
const { connectDB, closeDB } = require('./src/db/conn');

const routes = require('./src/routes/index');
const { badRequest } = require('./src/utils/messages');
app.use(require('./src/utils/responseHandler'));
const config = require('./src/config/config');

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Authorization',
      'Authentication',
      'Content-Type',
      'origin',
      'action',
      'accept',
      'token',
      'withCredentials',
    ],
    exposedHeaders: ['security_token'],
    maxAge: 86400,
  }),
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    limit: '10mb',
    extended: true,
  }),
);

app.use(config.prefix, routes);

app.get('/', (req, res) => {
  res.json({ message: 'time_backend is running' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return badRequest({ message: 'Invalid Json Formate...!' }, res);
  }
  next();
});

const server = http.createServer(app);

(async () => {
  try {
    // 🔹 Connect to MongoDB
    await connectDB();
    // 🔹 Initialize all MSSQL pools at startup
    await initializeAllConnections();

    server.listen(config.PORT, () => {
      console.log(`🚀 Server Running At Port : ${config.PORT}`);
    });

    // 🔹 Graceful shutdown on exit
    const shutdown = async () => {
      console.log('\n🛑 Shutting down server...');
      await closeAllConnections(); // MSSQL
      await closeDB(); // MongoDB

      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown); // Ctrl+C
    process.on('SIGTERM', shutdown); // Kill command
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
