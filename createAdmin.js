require('./models/db');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var shasum = require('crypto').createHash('sha512');
var bcrypt = require('bcrypt');
var readlineSync = require('readline-sync');


mongoose.connection.on('connected', function () {
  var username = readlineSync.question('Input admin username : ');
  var mail = readlineSync.question('Input admin email : ');
  var password = readlineSync.questionNewPassword('Input admin password : ',{
    min: 3
  });


  createAdmin(username, password, mail, function(err) {
    if(err) {
      console.error(err);
    }
    console.log('Done');
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
});

function createAdmin (username, plainTextPassword, mail, cb) {
  shasum.update(plainTextPassword);
  var hashedPassword = shasum.digest('hex');

  var user = new User({
    username: username,
    password: hashedPassword,
    email: mail,
    role: 'admin'
  });
  //console.log(user);

  User.findOne({username: user.username}, {'email': 0, 'name': 0}, function(err, doc) {
    if(err) {
      console.log(err);
    }
    if(doc) {
      var error = new Error('User already exists.');
      error.status = 500;
      return cb(error);
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        if(err) {
          console.log(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
          if(err) {
            console.log(err);
          }
          user.password = hash;
          user.save(function (err, data) {
            if(err) {
              console.log(err);
            }
            console.log(data);
            cb(null, data);
          });
        });
      });
    }
  });
}
