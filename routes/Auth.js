const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/UserModel');
const Validator = require('validatorjs');
const firebase = require('firebase');
const jwt = require('jsonwebtoken');

// POST /login
router.post('/login', (req, res, next) => {
  const { body } = req;
  const rules = {
    email: 'required|email',
    password: 'required',
  };
  const validation = new Validator(body, rules);
  if (validation.fails()) {
    const { errors: { errors } } = validation;
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
  const { email, password } = body;
  firebase.auth().signInWithEmailAndPassword(email, password).then(async auth => {
    const user = await UserModel.findOne({email}).exec();
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
      });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRETKEY, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
    const refreshToken = jwt.sign({ user }, process.env.JWT_SECRETKEY, {
      expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRESIN,
    });
    return res.status(200).json({
      code: 200,
      token,
      refreshToken,
    });
  }).catch(err => {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  });
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