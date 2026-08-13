const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { swaggerUi, specs } = require('./configs/swagger');

// Import Routes
const authRoute = require('./routes/authRoute');
const pegawaiRoute = require('./routes/pegawaiRoute');
const pendidikanRoute = require('./routes/pendidikanRoute');
const masterDataRoute = require('./routes/masterDataRoute');
const tunjanganRoute = require('./routes/tunjanganRoute');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy'
  });
});

// Routes API
app.use('/api/auth', authRoute);
app.use('/api', pegawaiRoute);
app.use('/api', pendidikanRoute);
app.use('/api', masterDataRoute);
app.use('/api', tunjanganRoute);

// Handle 404 - Endpoint not found
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

module.exports = app;
