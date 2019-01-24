const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/UserModel');
const Validator = require('validatorjs');
const firebase = require('firebase');

// POST /login
router.post('/login', (req, res, next) => {
  return res.json({});
});

// POST /signup
router.post('/signup', (req, res, next) => {
  const { body } = req;
  const rules = {
    name: 'required|string',
    lastname: 'required|string',
    email: 'required|email',
    password: 'required|string|confirmed',
    password_confirmation: 'required|string',
  };
  const validation = new Validator(body, rules);
  if (validation.fails()) {
    const { errors: { errors } } = validation;
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
  const { name, lastname, email, password } = body;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(account => {
    const User = new UserModel({
      name,
      lastname,
      email,
      providerId: account.user.uid,
    });
    User.save();
    return res.status(201).json();
  }).catch(err => {
    return res.status(400).json({
      code: 400,
      message: err.message,
    });
  });
});

module.exports = router;