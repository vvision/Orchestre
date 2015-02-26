var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var checkAuth = require('./utils/checkAuth');

router.get('/', checkAuth.checkAuth, users);
router.post('/', checkAuth.isAdmin, createUser);//TODO: Check Admin
router.get('/:id', aboutUser);
router.get('/:id/about', aboutUser);

module.exports = router;

function users (req, res, next) {
  var pageNumber = req.query.page ? req.query.page : 1;
  var resultsPerPage = 50;
  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;

  User.find({}, {'password': 0, 'email': 0, 'name': 0}).sort('username').skip(skipFrom).limit(resultsPerPage).exec(function (err, docs) {
    //console.log(docs);
    if(err) {
      console.error(err);
    }
    res.send(docs);
  });
}

function createUser (req, res, next) {
  var user = new User(req.body);
  //console.log(user);

  User.findOne({username: user.username}, {'email': 0, 'name': 0}, function(err, doc) {
    if(err) console.log(err);
    if(doc) {
      var error = new Error('User already exists.');
      error.status = 500;
      return next(error);
    } else {
      user.save(function (err, data) {
        if (err) console.log(err);
        console.log(data);
        res.send(data);
      });
    }
  });
}

function aboutUser (req, res, next) {
  var id = req.params.id;
  console.log(id);

  User.findById(id, {'password': 0, 'email': 0, 'name': 0}, function(err, doc) {
    console.log(doc);
    res.send(doc);
  });
}
