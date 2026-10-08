const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const contactRoutes = require('./routes/contactRoutes');
const { errorHandler, ApiError } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static dashboard for live testing and video demo
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'CodSoft Task 2 - Contact Management System API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/contacts', contactRoutes);

app.all('/api/*', (req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

module.exports = app;
