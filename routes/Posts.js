const express = require('express');
const router = express.Router();
const { PostModel } = require('../models/PostModel');
const { UserModel } = require('../models/UserModel');
const Validator = require('validatorjs');
const { Types: { ObjectId } } = require('mongoose');

/* GET / */
router.get('/', async (req, res, next) => {
  const posts = await PostModel.find().exec();
  return res.status(200).json({ posts });
});

/* GET /:id */
router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  const isObjectId = ObjectId.isValid(id);
  if(!isObjectId) {
    return res.status(400).json({
      code: 400,
      message: 'The param :id is not valid',
    });
  }
  const post = await PostModel.findById(id).exec();
  return res.status(200).json(post);
});

/* POST / */
router.post('/', async (req, res, next) => {
  const { body, userId } = req;
  const rules = {
    content: 'required|string',
  };
  const validation = new Validator(body, rules);
  if (validation.fails()) {
    const { errors: { errors } } = validation;
    return res.status(400).json({
      code: 400,
      errors,
    });
  }

  const user = await UserModel.findById(userId).exec();
  if(!user) {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }

  const { content } = body;
  const post = new PostModel({ content, user });
  post.save();
  return res.status(201).json();
});

/* PUT /:id */
router.put('/:id', async (req, res, next) => {
  const { body, params: { id } } = req;
  
  const isObjectId = ObjectId.isValid(id);
  if(!isObjectId) {
    return res.status(400).json({
      code: 400,
      message: 'The param :id is not valid',
    });
  }

  const rules = {
    content: 'required|string',
  };
  const validation = new Validator(body, rules);
  if (validation.fails()) {
    const { errors: { errors } } = validation;
    return res.status(400).json({
      code: 400,
      errors,
    });
  }

  const { content } = body;
  const post = await PostModel.findByIdAndUpdate(id, { 
    $set: { content } 
  }, { new: true });
  post.save();
  return res.status(200).json(post);
});

/* DELETE /:id */
router.delete('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  
  const isObjectId = ObjectId.isValid(id);
  if(!isObjectId) {
    return res.status(400).json({
      code: 400,
      message: 'The param :id is not valid',
    });
  }

  await PostModel.findByIdAndDelete(id);
  return res.status(200).json();
});

module.exports = router;
