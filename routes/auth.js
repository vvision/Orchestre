var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/login', login);
router.get('/status', status);
router.post('/logout', logout);

module.exports = router;

function login (req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      var error = new Error('Unable to log you in.');
      error.status = 401;
      return next(error);
    }
    console.log(user);

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });

  })(req, res, next);
}

function status (req, res, next) {
  if(req.user.username && req.user.role) {
    User.findOne({username: req.user.username}, {'password': 0}, function(err, doc) {
      console.log(doc);
      res.send(doc);
    });
  } else {
    var error = new Error('Not currently logged in.');
    error.status = 401;
    return next(error);
  }
}

function logout (req, res) {
  console.log('logout');
  req.logout();
  res.redirect('/');
}
