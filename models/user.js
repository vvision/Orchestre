var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {type: String, index: 'true'},
  password: String,
  name: String,
  email: String,
  createdAt: {type: Date, 'default': Date.now},
  website: String,
  location: String,
  role: {type: String, 'default': 'user'}
});

var User = mongoose.model('User', userSchema);
