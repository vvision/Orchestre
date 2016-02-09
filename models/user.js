var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true, index: 'true'},
  password: String,
  name: String,
  email: { type: String, unique: true },
  createdAt: {type: Date, default: Date.now},
  website: String,
  location: String,
  role: {type: String, default: 'user'}
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isSame) {
    cb(null, isSame);
  });
};

mongoose.model('User', userSchema);
