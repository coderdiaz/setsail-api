const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { UserSchema }  = require('./UserModel')

const PostSchema = new Schema({
  content: {
    type: String,
  },
  likes: {
    type: Number,
  },
  forwards: {
    type: Number,
  },
  user: {
    type: UserSchema,
  },
}, {
  timestamps: true,
});

// Model
const PostModel = mongoose.model('Post', PostSchema);
module.exports = { PostSchema, PostModel };
