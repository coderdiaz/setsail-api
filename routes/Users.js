const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/UserModel');

/* GET / */
router.get('/', async (req, res, next) => {
  const data = await UserModel.find().exec();
  return res.status(200).json(data);
});

/* POST / */
router.post('/', (req, res, next) => {
  const { body: { name, lastname, email } } = req;
  const User = new UserModel({
    name,
    lastname,
    email,
  });
  User.save();
  return res.status(201).json({
    code: 201,
    message: 'User created',
  });
});

module.exports = router;