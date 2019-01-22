const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: String,
  },
  bio: {
    type: String,
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  avatar: {
    type: String,
  },
}, {
  timestamps: true,
});

// Model
const UserModel = mongoose.model('User', UserSchema);
module.exports = { UserSchema, UserModel };