var express = require('express');
var router = express.Router();
var passport = require('passport');

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
    res.send({
      username: req.user.username,
      role: req.user.role
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
