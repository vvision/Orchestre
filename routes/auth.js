var express = require('express');
var router = express.Router();
var conf = require('../config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var checkAuth = require('./utils/checkAuth').checkAuth;

router.post('/login', login);
router.get('/status', status);
router.post('/logout', checkAuth, logout);

module.exports = router;

function login (req, res, next) {
  var login = req.body.login;
  var incomingHashedPassword = req.body.password;

  if (req.session.authed) {
    // Already logged in.
    res.send({
      username: req.session.username,
      role: req.session.role
    });
  } else {
    if (login === conf.login && incomingHashedPassword === conf.hashedPassword) {
      req.session.username = login;
      req.session.authed = true;
      req.session.role = 'admin';
      res.send({
        username: conf.login,
        role: 'admin'
      });
    } else {
      User.findOne({username: login}, {'_id': 0, '_v': 0, 'email': 0, 'name': 0}, function(err, doc) {
        console.log(doc);
        if(err) {
          var error = new Error('This user does not exist.');
          error.status = 401;
          return next(error);
        } else if(doc.username === login && doc.password === incomingHashedPassword) {
          req.session.username = login;
          req.session.authed = true;
          req.session.role = doc.role;

          var user = doc;
          delete user.password;
          res.send(user);
        } else {
          var error = new Error('Unable to log you in.');
          error.status = 401;
          return next(error);
        }
      });
    }
  }
}

function status(req, res, next) {
  if(req.session.username && req.session.role) {
    res.send({
      username: req.session.username,
      role: req.session.role
    });
  } else {
    var error = new Error('Not currently logged in.');
    error.status = 401;
    return next(error);
  }
}

function logout (req, res) {
  req.session = null;
  res.sendStatus(200);
}
