const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },

  password: {
    type: String
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],

  dp: {
    type: String
  },

  email: {
    type: String,
    require: true,
    unique: true
  },

  fullname: {
    type: String,
    require: true
  }
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);