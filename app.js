const express = require('express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const firebase = require('firebase');
require('firebase/auth');

// Firebase params
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = express();

// API Routes
const UsersRouter = require('./routes/Users');
const AuthRouter = require('./routes/Auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', UsersRouter);
app.use('/auth', AuthRouter);

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
