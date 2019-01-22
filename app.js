const express = require('express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');

const app = express();

// API Routes
const UsersRouter = require('./routes/Users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', UsersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  // Returning API error in JSON
  return res.status(statusCode).json({
    code: statusCode,
    message: err.message,
  });
});

module.exports = app;
