const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/UserModel');

/* GET / */
router.get('/', async (req, res, next) => {
  const data = await UserModel.find().exec();
  return res.status(200).json(data);
});

module.exports = router;